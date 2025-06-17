import { relations } from "drizzle-orm";
import { commentsTable } from "./comments";
import { manifestsTable } from "./manifests";
import { piecesTable } from "./pieces";
import { shipmentsTable } from "./shipments";

export const manifestRelations = relations(manifestsTable, ({ many }) => ({
  shipments: many(shipmentsTable),
}));

export const shipmentsRelations = relations(
  shipmentsTable,
  ({ many, one }) => ({
    pieces: many(piecesTable),
    comments: many(commentsTable),
    manifests: one(manifestsTable, {
      fields: [shipmentsTable.manifest],
      references: [manifestsTable.manifest],
    }),
  })
);

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  shipments: one(shipmentsTable, {
    fields: [commentsTable.shipmentID],
    references: [shipmentsTable.shipmentID],
  }),
}));

export const piecesRelations = relations(piecesTable, ({ one }) => ({
  shipments: one(shipmentsTable, {
    fields: [piecesTable.shipmentID],
    references: [shipmentsTable.shipmentID],
  }),
}));
