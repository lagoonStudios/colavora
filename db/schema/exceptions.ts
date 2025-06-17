import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { syncColumns } from "./base";

export const exceptionsTable = sqliteTable("exceptions", {
  reasonID: integer().primaryKey({ autoIncrement: true }),
  companyID: text(),
  customerID: integer(),
  reasonCode: text(),
  reasonDesc: text(),
  reasonCodeDesc: text(),
  completeOrder: integer({ mode: "boolean" }).notNull().default(false),
  lang: text().notNull(),
  ...syncColumns,
});

export type TExceptionsData = typeof exceptionsTable.$inferSelect;
