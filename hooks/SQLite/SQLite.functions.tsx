import { createManifestsTable } from "./queries/manifests.local.queries";
import { createShipmentTable } from "./queries/shipments.local.queries";
import { createCommentsTable } from "./queries/comments.local.queries";
import { createPiecesTable } from "./queries/pieces.local.queries";
import { createExceptionsTable } from "./queries/exceptions.local.queries";
import { createCODTable } from "./queries/cod.local.queries";

export function createAllDBTables() {
  return new Promise((resolve, reject) => {
    Promise.all([
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
        console.error(
          "🚀 ~ file: SQLite.functions.tsx:22 ~ returnnewPromise ~ error:",
          error,
        );
        reject(error);
      });
  });
}

export function dropAllTables() {
  return new Promise((resolve, reject) => {
    reject("Not implemented");
  });
}
