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

// Export the relations
export { manifestRelations } from "./schema";
export { shipmentsRelations } from "./schema";
export { commentsRelations } from "./schema";
export { piecesRelations } from "./schema";
