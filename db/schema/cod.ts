import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { syncColumns } from "./base";

export const codTable = sqliteTable("cod", {
  codTypeID: integer().primaryKey({ autoIncrement: true }),
  codType: text(),
  companyID: text().notNull(),
  lang: text().notNull(),
  ...syncColumns,
});

export type TCODData = typeof codTable.$inferSelect;
