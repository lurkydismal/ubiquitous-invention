// npm install cache-manager cache-manager-ioredis ioredis

import { caching } from 'cache-manager';
import redisStore from 'cache-manager-ioredis-yet';

const cache = await caching(redisStore, {
    host: 'localhost',
    port: 6379,
    ttl: 60 // seconds
});

await cache.set('key', 'value');
const value = await cache.get('key');

// npm install drizzle-orm drizzle-kit pg
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pgTable, text, serial } from "drizzle-orm/pg-core";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name"),
});

const result = await db.select().from(users);
