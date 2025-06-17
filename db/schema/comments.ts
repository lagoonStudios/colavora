import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { syncColumns } from "./base";

export const commentsTable = sqliteTable("comments", {
  id: integer().primaryKey({ autoIncrement: true }),
  createdDate: text(),
  comment: text(),
  shipmentID: integer(),
  ...syncColumns,
});

export type TCommentsData = typeof commentsTable.$inferSelect;
