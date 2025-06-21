import { sql } from "drizzle-orm";
import { text, integer } from "drizzle-orm/sqlite-core";

export const syncColumns = {
  isSync: integer({ mode: "boolean" }).notNull().default(true),
  lastSync: text()
    .notNull()
    .default(sql`(current_timestamp)`),
};

export const timestamps = {
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  deletedAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
};
