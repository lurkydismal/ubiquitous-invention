/**
 * Utility functions for server and client use.
 */

import { PostsRowFull, UsersRowPublic } from "@/db/types";

/**
 * Get an environment variable or return a default if missing.
 *
 * @param key - Environment variable name
 * @param defaultValue - Optional default value to use if the env var is missing
 * @returns Value of the environment variable, or the default if provided
 * @throws Error if the variable is missing and no default is provided
 */
export function getEnv(key: string, defaultValue?: string): string {
    const value = process.env[key];

    if (value !== undefined) {
        return value;
    }

    if (defaultValue !== undefined) {
        return defaultValue;
    }

    console.error(`Environment variable "${key}" is not set`);
    throw new Error(`Missing environment variable: ${key}`);
}

/**
 * Parse a string into boolean.
 * Accepts "true", "1", "yes" (case-sensitive) as true. Everything else is false.
 */
export function parseBool(value: string): boolean {
    return value === "true" || value === "1" || value === "yes";
}

/**
 * Encode each segment of a URL/path safely.
 * Filters out empty segments to avoid "//" and encodes each segment.
 */
export function encodePath(path: string): string {
    return path.split("/").filter(Boolean).map(encodeURIComponent).join("/");
}

/**
 * Sanitize a filename to be filesystem-safe.
 * - Replaces spaces with underscores
 * - Replaces non-alphanumeric characters with underscores
 * - Removes leading dots
 * - Truncates to 100 characters
 * - Converts to lowercase
 *
 * @param raw - Input to sanitize
 * @returns Sanitized string or null if invalid/empty
 */
export function sanitizeFilename(raw: unknown): string | null {
    if (typeof raw !== "string") return null;

    const s = raw
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
        .replace(/^\.+/, "")
        .slice(0, 100)
        .toLowerCase();

    return s || null;
}

/**
 * Convert a string to camelCase.
 * - Trims and lowercases
 * - Removes special characters except spaces
 * - Converts words after spaces to uppercase
 */
export function toCamelCase(text: string): string {
    return text
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 ]+/g, "")
        .replace(/\s+([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Convert a string to PascalCase.
 *
 * Rules:
 * - Trims whitespace
 * - Removes special characters except letters and numbers
 * - Splits on spaces, hyphens, and underscores
 * - Capitalizes the first letter of each word
 *
 * Examples:
 * "hello world"     → "HelloWorld"
 * "  user_name  "   → "UserName"
 * "foo-bar-baz"     → "FooBarBaz"
 * "FOO 2 bar!"      → "Foo2Bar"
 *
 * @param text - The input string
 * @returns PascalCase version of the string
 */
export function toPascalCase(text: string): string {
    if (!text) return "";

    return (
        text
            .trim()
            .toLowerCase()
            // Replace any non-alphanumeric separator with a single space
            .replace(/[\s-_]+/g, " ")
            // Remove any remaining non-alphanumeric characters
            .replace(/[^a-z0-9 ]+/g, "")
            // Split by spaces, capitalize each word, join
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join("")
    );
}

/**
 * Type guard to check if an input is a plain object (Record<string, any>).
 *
 * @param input - The value to check
 * @returns True if input is a plain object
 */
export function isRecord(input: unknown): input is Record<string, any> {
    if (typeof input !== "object" || input === null) return false;

    const proto = Object.getPrototypeOf(input);
    return proto === Object.prototype || proto === null;
}

/**
 * Type guard for Blob objects.
 *
 * @param v - Value to check
 * @returns True if v is a Blob instance
 */
export function isBlob(v: unknown): v is Blob {
    return v instanceof Blob;
}

/**
 * Extract a value from FormData, Record, or return raw value.
 *
 * @template T - Expected type
 * @param input - FormData, Record, or raw value
 * @param key - Key to extract if input is FormData or Record
 * @returns Extracted value or undefined
 */
export function extractFromFormData<T = unknown>(
    input: FormData | Record<string, any> | unknown,
    key: string,
): T | undefined {
    if (input instanceof FormData) {
        const value = input.get(key);
        return value === null ? undefined : (value as T);
    }

    if (isRecord(input)) {
        if (!key) return undefined;
        return input[key] as T | undefined;
    }

    return input as T | undefined;
}

/**
 * Delay execution for a specified number of milliseconds.
 * - Validates input to avoid invalid or excessive delays.
 */
export function delay(milliseconds: number): Promise<void> {
    const ms = Number(milliseconds);

    // Validate delay to avoid unbounded timers from untrusted input
    if (!Number.isFinite(ms) || ms < 0) {
        throw new Error(`Invalid delay value: ${milliseconds}`);
    }

    // Enforce an upper bound to prevent resource exhaustion
    const MAX_DELAY_MS = 60_000; // 1 minute
    if (ms > MAX_DELAY_MS) {
        throw new Error(
            `Delay value ${milliseconds} exceeds maximum allowed of ${MAX_DELAY_MS} ms`,
        );
    }

    return new Promise((resolve) => setTimeout(resolve, Math.floor(ms)));
}

/**
 * Paginate an array of items.
 *
 * @template T - Array element type
 * @param items - Array of items to paginate
 * @param currentPage - 1-based page number
 * @param perPage - Number of items per page
 * @returns Slice of items for the current page
 */
export function paginate<T>(
    items: T[],
    currentPage: number,
    perPage: number,
): T[] {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    return items.slice(start, end);
}

/**
 * Concatenate post authors and co-author (if any).
 *
 * @param post - Post object
 * @returns Array of authors (primary + co-author)
 */
export function concatenateAuthors(post: PostsRowFull): UsersRowPublic[] {
    return [
        post.author ?? {
            username: "Unknown",
            username_normalized: "Unknown",
            avatar_url: null,
        },
        ...(post.coAuthor ? [post.coAuthor] : []),
    ];
}

/**
 * A utility function that normalizes a value or the first element of an array.
 *
 * This function checks if the input `item` is an array. If it is, the function returns the first element of the array.
 * If the input is a single value (not an array), the function returns the value itself.
 *
 * @template T - The type of the value that is passed in. This can be any type, and it can also be an array of that type.
 * @param item - The value to be normalized. It can either be a single value of type `T` or an array of values of type `T[]`.
 * @returns The normalized value: if `item` is an array, it returns the first element (`item[0]`), otherwise it returns `item` itself.
 *
 * @example
 * // If the input is an array, return the first element.
 * normalizeArrayOrValue([1, 2, 3]); // Returns: 1
 *
 * // If the input is a single value, return the value itself.
 * normalizeArrayOrValue(5); // Returns: 5
 */
export function normalizeArrayOrValue<T>(item: T | T[]): T {
    return Array.isArray(item) ? item[0] : item;
}

/**
 * [TODO:description]
 */
type AwaitedObject<T extends Record<PropertyKey, any>> = {
    [K in keyof T]: Awaited<T[K]>;
};

/**
 * [TODO:class]
 */
export async function awaitObject<T extends Record<PropertyKey, any>>(
    obj: T,
): Promise<AwaitedObject<T>> {
    const entries = Object.entries(obj);

    const resolved = await Promise.all(
        entries.map(async ([key, value]) => {
            return [key, await value] as const;
        }),
    );

    return Object.fromEntries(resolved) as AwaitedObject<T>;
}

/**
 * Counts words in a string using a Unicode-aware regular expression.
 *
 * Rules:
 * - Supports all languages via Unicode property escapes.
 * - Treats punctuation (.,!? etc.) as separators.
 * - Keeps contractions like "don't" as one word.
 * - Treats "one,two" as two words.
 *
 * @param text - The input text to analyze
 * @returns The number of detected words
 */
export function getAccurateWordCount(text: string): number {
    if (!text) return 0;

    const words = text.match(/\b[\p{L}\p{N}']+\b/gu);

    return words ? words.length : 0;
}

/**
 * Calculates estimated reading time in minutes.
 *
 * Industry standard average reading speed:
 * - 200–250 words per minute
 * - Default used here: 225 wpm
 *
 * Always returns at least 1 minute for non-empty content.
 *
 * @param wordCount - Total number of words
 * @param wordsPerMinute - Optional reading speed override
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(
    wordCount: number,
    wordsPerMinute: number = 225,
): number {
    if (!wordCount) return 0;

    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Formats reading time (in minutes) into a human-friendly string
 * with proper English pluralization.
 *
 * Rules:
 * - 0 minutes → "0 minutes"
 * - Under 60 minutes → "X minute(s)"
 * - 60+ minutes → "X hour(s) Y minute(s)"
 *
 * Examples:
 * - 1   → "1 minute"
 * - 15  → "15 minutes"
 * - 60  → "1 hour"
 * - 75  → "1 hour 15 minutes"
 * - 120 → "2 hours"
 *
 * @param minutes - Total reading time in minutes
 * @returns Formatted reading time string
 */
export function formatReadingTime(minutes: number): string {
    if (minutes <= 0) return "0 minutes";

    const pluralize = (value: number, singular: string, plural: string) =>
        value === 1 ? singular : plural;

    if (minutes < 60) {
        return `${minutes} ${pluralize(minutes, "minute", "minutes")}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    const hourLabel = pluralize(hours, "hour", "hours");

    if (remainingMinutes === 0) {
        return `${hours} ${hourLabel}`;
    }

    const minuteLabel = pluralize(remainingMinutes, "minute", "minutes");

    return `${hours} ${hourLabel} ${remainingMinutes} ${minuteLabel}`;
}
