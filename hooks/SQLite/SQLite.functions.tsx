import * as SQLite from "expo-sqlite";
import { createManifestsTable } from "./manifests.database";
import { createShipmentTable } from "./shipments.database";

export function createAllDBTables(db: SQLite.SQLiteDatabase) {
  createManifestsTable(db);
  createShipmentTable(db);
}
