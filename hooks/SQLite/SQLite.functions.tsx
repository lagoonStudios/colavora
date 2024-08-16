import { SQLiteDatabase } from "expo-sqlite";

import { createCODTable } from "./cod.local.queries";
import { createPiecesTable } from "./pieces.local.queries";
import { createCommentsTable } from "./comments.local.queries";
import { createShipmentTable } from "./shipments.local.queries";
import { createManifestsTable } from "./manifests.local.queries";
import { createExceptionsTable } from "./exceptions.local.queries";

export function createAllDBTables() {
  return new Promise(async (resolve, reject) => {
    await Promise.all([
      createManifestsTable(),
      createShipmentTable(),
      createCommentsTable(),
      createPiecesTable(),
      createExceptionsTable(),
      createCODTable(),
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

export function dropAllTables(db: SQLiteDatabase) {
  return new Promise((resolve, reject) => {
    reject("Not implemented");
  });
}
