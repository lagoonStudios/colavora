import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { relations } from "drizzle-orm";
import { manifestsTable } from "./schema/manifests";
import { shipmentsTable } from "./schema/shipments";
import { piecesTable } from "./schema/pieces";
import { commentsTable } from "./schema/comments";

export const DATABASE_NAME = "colavora";

// Initialize the database
const expoDb = openDatabaseSync(DATABASE_NAME);

// Create Drizzle instance
export const db = drizzle(expoDb);

// Export the raw Expo SQLite instance for tools like Drizzle Studio
export { expoDb };

// Export the SQLiteProvider for use in components
export { SQLiteProvider } from "expo-sqlite";

// Export database migration utilities
export { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
export { useDrizzleStudio } from "expo-drizzle-studio-plugin";

// Export repositories
export { CODLocalService } from "./repositories/cod.repository";
export { CommentsLocalService } from "./repositories/comments.repository";
export { ExceptionLocalService } from "./repositories/exceptions.repository";
export { ManifestsLocalService } from "./repositories/manifests.repository";
export { PiecesLocalService } from "./repositories/pieces.repository";
export { ShipmentLocalService } from "./repositories/shipments.repository";

// Creates the relations between tables
export const manifestRelations = relations(manifestsTable, ({ many }) => ({
  shipments: many(shipmentsTable),
}));

export const shipmentRelations = relations(shipmentsTable, ({ one, many }) => ({
  manifest: one(manifestsTable, {
    fields: [shipmentsTable.manifest],
    references: [manifestsTable.manifest],
  }),
  pieces: many(piecesTable),
  comments: many(commentsTable),
}));

export const piecesRelations = relations(piecesTable, ({ one }) => ({
  shipments: one(shipmentsTable, {
    fields: [piecesTable.shipmentID],
    references: [shipmentsTable.shipmentID],
  }),
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  shipments: one(shipmentsTable, {
    fields: [commentsTable.shipmentID],
    references: [shipmentsTable.shipmentID],
  }),
}));
