import { SQLiteDatabase } from "expo-sqlite";

import { createManifestsTable } from "./manifests.local.queries";
import { createShipmentTable } from "./shipments.local.queries";
import { createCommentsTable } from "./comments.local.queries";
import { createPiecesTable } from "./pieces.local.queries";

export function createAllDBTables(db: SQLiteDatabase) {
  return new Promise(async (resolve, reject) => {
    await Promise.all([
      createManifestsTable(db),
      createShipmentTable(db),
      createCommentsTable(db),
      createPiecesTable(db),
    ])
      .then((res) => {
        console.log(res);
        resolve("Tables created correctly");
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}

export function dropAllTables(db: SQLiteDatabase) {}
