import * as SQLite from "expo-sqlite";
import { createManifestsTable } from "./manifests.local.queries";
import { createShipmentTable } from "./shipments.local.queries";
import { createCommentsTable } from "./comments.local.queries";

export function createAllDBTables(db: SQLite.SQLiteDatabase) {
  createManifestsTable();
  createShipmentTable();
  createCommentsTable();
}
