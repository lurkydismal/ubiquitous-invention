import { z } from "zod";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-orm/zod";
import { categories, follows, posts, users } from "@/db/schema";
import dayjs from "@/utils/dayjs";
import { Dayjs } from "dayjs";

export const emptyToNull = <T extends z.ZodTypeAny>(schema: T) =>
    z.preprocess((val) => (val === "" ? null : val), schema.nullable());

/**
 * Zod schema for validating date input.
 *
 * Accepts three types of values:
 * - `string` – a date string that Day.js can parse
 * - `Date` – a native JavaScript Date object
 * - `Dayjs` – an existing Day.js instance
 *
 * Validation behavior:
 * - `superRefine` runs a semantic check using `dayjs(v).isValid()`
 *   to ensure the value represents a valid date.
 * - If invalid, a Zod issue with the message "Invalid date" is added.
 *
 * Transformation behavior:
 * - `.transform((v) => dayjs(v))` converts all valid input types
 *   into a normalized Day.js instance.
 *
 * The schema is described as "Date input (string, Date, or Dayjs)" for
 * documentation and tooling purposes.
 */
export const dateInputSchema = z
    .union([
        z.string(),
        z.date(),
        // TODO: Maybe this
        // .refine(
        //     (d) => !Number.isNaN(d.getTime()),
        //     "Invalid date"
        // ),
        z.custom<Dayjs>((v) => dayjs.isDayjs(v)),
    ])
    .superRefine((v, ctx) => {
        if (!dayjs(v).isValid()) {
            ctx.addIssue({
                code: "custom",
                message: "Invalid date",
            });
        }
    })
    .transform((v) => dayjs(v))
    .describe("Date input (string, Date, or Dayjs)");

/**
 * User schemas for select, insert, and update operations.
 * - `userSelectSchema` – full user selection schema
 * - `userInsertSchema` – fields required for insertion
 * - `userUpdateSchema` – fields allowed for update
 * - `userSelectPublicSchema` – public-facing version excluding sensitive fields
 */
export const userSelectSchema = createSelectSchema(users);
export const userInsertSchema = createInsertSchema(users);
export const userUpdateSchema = createUpdateSchema(users);
export const userSelectPublicSchema = userSelectSchema
    .omit({
        id: true,
        password_hash: true,
        created_at: true,
        updated_at: true,
    })
    .extend({
        username: z.string().trim().min(1),
        username_normalized: z.string().trim().min(1).lowercase(),
        avatar_url: z.string().trim().min(1).nullable(),
    });

/**
 * Follow schemas for select, insert, and update operations.
 * - `followSelectSchema` – full follow selection schema
 * - `followInsertSchema` – insertion fields
 * - `followUpdateSchema` – update fields
 * - `followSelectPublicSchema` – public-facing version omitting created_at
 */
export const followSelectSchema = createSelectSchema(follows);
export const followInsertSchema = createInsertSchema(follows);
export const followUpdateSchema = createUpdateSchema(follows);
export const followSelectPublicSchema = followSelectSchema.omit({
    created_at: true,
});

/**
 * Category schemas for select, insert, and update operations.
 * - `categorySelectSchema` – full category selection
 * - `categoryInsertSchema` – insertion fields
 * - `categoryUpdateSchema` – update fields
 * - `categorySelectPublicSchema` – public-facing version with only name
 */
export const categorySelectSchema = createSelectSchema(categories);
export const categoryInsertSchema = createInsertSchema(categories);
export const categoryUpdateSchema = createUpdateSchema(categories);
export const categorySelectPublicSchema = categorySelectSchema
    .pick({ name: true })
    .extend({ name: z.string().trim().min(1) });

/**
 * Post schemas for select, insert, and update operations.
 * - `postSelectSchema` – full post selection
 * - `postInsertSchema` – insertion fields
 * - `postUpdateSchema` – update fields
 * - `postFullSchema` – full post with nested author, co-author, and category, omitting raw IDs
 */
export const postSelectSchema = createSelectSchema(posts);
export const postInsertSchema = createInsertSchema(posts);
export const postUpdateSchema = createUpdateSchema(posts);
export const postFullSchema = postSelectSchema
    .extend({
        author: userSelectPublicSchema,
        coAuthor: userSelectPublicSchema,
        category: categorySelectSchema,
    })
    .omit({
        author_id: true,
        co_author_id: true,
        category_id: true,
    });

export const postVisibilitySchema = postInsertSchema.shape.visibility;

// FIX: Optional not applying to ""
export const postNewSchema = z.object({
    // Write form
    title: z.string().min(10, "Title too short").max(50, "Title too long"),
    description: z
        .string()
        .min(10, "Description too short")
        .max(100, "Description too long")
        .optional(),
    content: z.string().min(100, "Content too short"),
    "reading-time": z.number().int().min(1),

    // Settings form
    visibility: postVisibilitySchema,
    "content-warning": z.boolean().optional(),
    category: z.string().nonempty(),
    publish: z.enum(["now", "scheduled"]),
    "co-author": z.string().nonempty().optional(),
    "attribution-note": z.string().nonempty().optional(),
});
