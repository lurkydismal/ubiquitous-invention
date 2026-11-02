/**
 * Database configuration for PostgreSQL using Drizzle ORM.
 *
 * - Loads environment variables from .env.
 * - Configures Drizzle with snake_case mapping.
 * - Sets up a custom logger that routes Drizzle logs to a browser-style logger.
 * - Exports the configured database instance for use across the application.
 */
import "server-only";
import "dotenv/config";
import { DefaultLogger } from "drizzle-orm/logger";
import type { LogWriter } from "drizzle-orm/logger";
import { drizzle } from "drizzle-orm/node-postgres";

import log from "@/utils/stdlog";

import { relations } from "./relations";

// Custom implementation of Drizzle's LogWriter interface
// All log messages from Drizzle will be routed through this writer
class MyLogWriter implements LogWriter {
    /**
     * Forwards database driver notices to log.debug().
     */
    write(message: string) {
        log.debug(message);
    }
}

// Instantiate the default Drizzle logger using the custom writer
const logger = new DefaultLogger({ writer: new MyLogWriter() });

// Validate required connection settings at startup instead of allowing a
// malformed connection object to fail later with an opaque driver error.
const requiredEnv = ["POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB", "DB_HOST"] as const;
for (const name of requiredEnv) {
    if (process.env[name] === undefined || process.env[name] === "") {
        throw new Error(`Missing required database environment variable: ${name}`);
    }
}

const dbPort = Number(process.env["DB_PORT"]);
if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error("DB_PORT must be an integer between 1 and 65535");
}

// Create the Drizzle database instance for PostgreSQL.
const db = drizzle({
    connection: {
        user: process.env["POSTGRES_USER"]!,
        password: process.env["POSTGRES_PASSWORD"]!,
        database: process.env["POSTGRES_DB"]!,
        host: process.env["DB_HOST"]!,
        port: dbPort,
    },
    logger,
    relations: relations,
});

export default db;
