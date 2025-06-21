import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { syncColumns } from "./base";

export const piecesTable = sqliteTable("pieces", {
  pieceID: integer().primaryKey({ autoIncrement: true }),
  companyID: text(),
  barcode: text(),
  packageType: integer(),
  packageTypeName: text(),
  comments: text(),
  pwBack: text(),
  pod: text(),
  shipmentID: integer().notNull(),
  ...syncColumns,
});

export type TPiecesData = typeof piecesTable.$inferSelect;
export type TPiecesInsertData = Omit<TPiecesData, "isSync" | "lastSync">;
