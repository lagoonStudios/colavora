import { openDatabaseSync } from "expo-sqlite";

const DB_NAME = "test.db";
export const db = openDatabaseSync(DB_NAME, { useNewConnection: true });
