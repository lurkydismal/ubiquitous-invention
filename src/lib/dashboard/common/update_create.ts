"use server";

import { and, eq, getColumns } from "drizzle-orm";
import type { AnyColumn, SQL } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-orm/zod";
import z from "zod";

import db from "@/db";
import { updateDbCacheTags } from "@/lib/cache";
import { emitDashboardChange } from "@/lib/dashboard/common/change-events";
import { getSession } from "@/lib/dal/auth";
import { parseRawTarget } from "@/lib/types";
import type { ActionResult, DbTarget } from "@/lib/types";
import { toCamelCase } from "@/utils/stdfunc";
import log from "@/utils/stdlog";
import { mutationInputSchema } from "@/utils/validate/schemas";

type MutationRow = Record<string, unknown>;

type SaveOptions = {
    isUpdate?: boolean;
    idColumnName?: string | string[];
};

/**
 * Converts input into db mutation.
 */
function toDbMutation(parsedRow: MutationRow, actorId: string, opts: SaveOptions): MutationRow {
    const base = { ...parsedRow };

    // These fields are controlled by the server, not by dashboard form input.
    delete base["id"];
    delete base["author_id"];
    delete base["last_editor_id"];
    delete base["created_at"];
    delete base["updated_at"];

    if (opts.isUpdate) {
        return {
            ...base,
            last_editor_id: actorId,
            updated_at: new Date(),
        };
    }

    return {
        ...base,
        author_id: actorId,
        last_editor_id: actorId,
    };
}

/**
 * Normalizes one-or-many id columns into an array.
 */
function normalizeIdColumns(idColumnName: string | string[]): string[] {
    return Array.isArray(idColumnName) ? idColumnName : [idColumnName];
}

/**
 * Gets the value for a primary-key column from parsed input.
 */
function getPrimaryKeyValue(parsedInput: MutationRow, idColumnName: string): unknown {
    const camelKey = toCamelCase(idColumnName);

    return parsedInput[camelKey] ?? parsedInput[idColumnName];
}

/**
 * Builds the primary-key filter for update/existence queries.
 */
function buildPrimaryKeyWhereClause(
    rawTarget: DbTarget,
    parsedInput: MutationRow,
    idColumnNames: string[],
): SQL {
    if (idColumnNames.length === 0) {
        throw new Error("Missing primary key columns for update");
    }

    const table = parseRawTarget(rawTarget);
    const idColumns = getColumns(table) as Record<string, AnyColumn | undefined>;

    const predicates = idColumnNames.map((columnName) => {
        const column = idColumns[columnName];
        if (!column) {
            throw new Error(`Unknown primary key column: ${columnName}`);
        }
        const value = getPrimaryKeyValue(parsedInput, columnName);
        if (value === undefined) {
            throw new Error(`Missing primary key value for ${columnName}`);
        }
        return eq(column, value);
    });

    if (predicates.length === 1) {
        return predicates[0]!;
    }

    return and(...predicates)!;
}

/**
 * Removes normalized primary-key fields from an update mutation payload.
 */
function removeIdColumnsFromMutation(row: MutationRow, idColumns: AnyColumn[]): MutationRow {
    const mutation = { ...row };
    for (const column of idColumns) {
        const dbKey = column.name;

        delete mutation[toCamelCase(dbKey)];
        delete mutation[dbKey];
    }

    return mutation;
}

/**
 * Saves the parsed row mutation to the database.
 */
export async function save(
    rawTarget: DbTarget,
    input: MutationRow,
    opts: SaveOptions = {},
): Promise<ActionResult> {
    const table = parseRawTarget(rawTarget);
    const parsedInput = await mutationInputSchema.parseAsync(input);

    const schema = opts.isUpdate ? createUpdateSchema(table) : createInsertSchema(table);

    const session = await getSession();
    if (!session) {
        return { ok: false, error: "Unauthorized" };
    }

    // Use the stable primary key from the session. User names are not unique
    // identifiers and must not be used to resolve an actor ID.
    const actorId = session.user.id;

    const row = await schema.parseAsync(toDbMutation(parsedInput, actorId, opts));

    if (opts.isUpdate) {
        if (!opts.idColumnName) {
            throw new Error("Missing id column for update");
        }

        const idColumnNames = normalizeIdColumns(opts.idColumnName);
        const columns = getColumns(table) as Record<string, AnyColumn | undefined>;

        if (new Set(idColumnNames).size !== idColumnNames.length) {
            return { ok: false, error: "Duplicate primary-key columns are not allowed" };
        }

        const idColumns: AnyColumn[] = [];
        for (const columnName of idColumnNames) {
            const column = columns[columnName];
            if (!column) {
                return { ok: false, error: `Unknown id column: ${columnName}` };
            }
            if (!column.primary) {
                return { ok: false, error: `Update key is not a primary-key column: ${columnName}` };
            }
            idColumns.push(column);
        }

        // Require the complete primary key. A partial composite key could
        // otherwise update several records before the affected-row check runs.
        const primaryColumnNames = Object.values(columns)
            .filter((column): column is AnyColumn => Boolean(column?.primary))
            .map((column) => column.name);
        if (
            primaryColumnNames.length === 0 ||
            primaryColumnNames.length !== idColumnNames.length ||
            primaryColumnNames.some((columnName) => !idColumnNames.includes(columnName))
        ) {
            return { ok: false, error: "Updates must include the complete primary key" };
        }

        const mutationRow = removeIdColumnsFromMutation(row, idColumns);
        const whereClause = buildPrimaryKeyWhereClause(rawTarget, parsedInput, idColumnNames);

        // RETURNING gives us the affected rows atomically, without a separate
        // existence query that could race with a concurrent delete.
        const updatedRows = await db
            .update(table)
            .set(mutationRow)
            .where(whereClause)
            .returning();

        if (updatedRows.length !== 1) {
            return { ok: false, error: "Update target no longer exists" };
        }
    } else {
        await db
            .insert(table)
            .values(row as any)
            .execute();
    }

    // Runs only after a successful mutation so cached DB reads do not stay stale.
    try {
        updateDbCacheTags([rawTarget]);
    } catch (cacheErr) {
        log.error("Cache revalidation error:", cacheErr);
    }

    await emitDashboardChange(rawTarget);

    return { ok: true, data: undefined };
}

/**
 * Parses form.
 */
export async function parseForm(
    formData: FormData,
    rawTarget: DbTarget,
): Promise<MutationRow> {
    const table = parseRawTarget(rawTarget);
    const columns = getColumns(table) as Record<string, AnyColumn | undefined>;
    const entries = Object.fromEntries(formData.entries()) as MutationRow;

    for (const [key, rawValue] of Object.entries(entries)) {
        if (typeof rawValue !== "string") continue;

        if (rawValue.trim() === "") {
            entries[key] = null;
            continue;
        }

        const column = columns[key];
        if (!column) continue;

        // FormData always transports scalar values as strings. Restore their
        // database-native types before passing the payload to Drizzle/Zod.
        if (column.dataType === "number") {
            const value = Number(rawValue);
            if (!Number.isFinite(value)) {
                throw new Error(`Invalid numeric value for ${key}`);
            }
            entries[key] = value;
        } else if (column.dataType === "boolean") {
            if (rawValue === "true" || rawValue === "1" || rawValue === "on") {
                entries[key] = true;
            } else if (rawValue === "false" || rawValue === "0") {
                entries[key] = false;
            } else {
                throw new Error(`Invalid boolean value for ${key}`);
            }
        } else if (column.dataType === "date") {
            const value = new Date(rawValue);
            if (Number.isNaN(value.getTime())) {
                throw new Error(`Invalid date value for ${key}`);
            }
            entries[key] = value;
        }
    }

    return mutationInputSchema.parse(entries) as MutationRow;
}
