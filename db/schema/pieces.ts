import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { syncColumns } from "./base";
import { relations } from "drizzle-orm";

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

// export const piecesRelations = relations(piecesTable, ({ one }) => ({
//   shipments: one(shipmentsTable, {
//     fields: [piecesTable.shipmentID],
//     references: [shipmentsTable.shipmentID],
//   }),
// }));
