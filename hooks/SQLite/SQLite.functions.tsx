import { SQLiteDatabase } from "expo-sqlite";

import { createManifestsTable } from "./manifests.local.queries";
import { createShipmentTable } from "./shipments.local.queries";
import { createCommentsTable } from "./comments.local.queries";
import { createPiecesTable } from "./pieces.local.queries";
import { createExceptionsTable } from "./exceptions.local.queries";
import { createCODTable } from "./cod.local.queries";

export function createAllDBTables(db: SQLiteDatabase) {
  return new Promise(async (resolve, reject) => {
    await Promise.all([
      createManifestsTable(db),
      createShipmentTable(db),
      createCommentsTable(db),
      createPiecesTable(db),
      createExceptionsTable(db),
      createCODTable(db),
    ])
      .then((res) => {
        resolve("Tables created correctly");
      })
      .catch((error) => {
        console.error("🚀 ~ createAllDBTables ~ error:", error);
        reject(error);
      });
  });
}

export function dropAllTables(db: SQLiteDatabase) {}
