import { db } from "../db";
import { IFetchPiecesByIdData } from "@constants/types/shipments";

/**
 * Creates a `pieces` table in the provided SQLite database if it doesn't exist.
 * Inserts an initial record into the table and returns a Promise.
 *
 * @returns A Promise that resolves to "Table created correctly" if successful, otherwise rejects with an error.
 */
export function createPiecesTable() {
  return new Promise((resolve: (value: string) => void, reject) => {
    db.execAsync(
      `
          CREATE TABLE IF NOT EXISTS pieces (
            pieceID INTEGER PRIMARY KEY UNIQUE,
            companyID TEXT FORE,
            barcode TEXT,
            packageType INTEGER,
            packageTypeName TEXT,
            comments TEXT,
            pwBack TEXT,
            pod TEXT,
            is_sync BOOLEAN DEFAULT false,
            last_sync TEXT DEFAULT (datetime('now')),
            shipmentID INTEGER NOT NULL,
            FOREIGN KEY (shipmentID) REFERENCES shipments(shipmentID)
            );

            CREATE INDEX IF NOT EXISTS pieces_shipmentID_idx ON pieces (shipmentID);
        `,
    )
      .then(() => {
        resolve("Table created correctly");
      })
      .catch((error) => {
        console.error(
          "🚀 ~ file: pieces.local.queries.ts:37 ~ createPiecesTable ~ error:",
          error,
        );
        reject("ERROR Creating pieces table: " + error);
      });
  });
}

export function dropPiecesTable() {
  return new Promise(
    (
      resolve: ({
        status,
        message,
      }: {
        status: number;
        message: string;
      }) => void,
      reject,
    ) => {
      db.execAsync(`DROP TABLE IF EXISTS pieces;`)
        .then(() => {
          resolve({
            status: 200,
            message: "Table dropped correctly",
          });
        })
        .catch((error) => {
          error(
            "🚀 ~ file: pieces.local.queries.ts:44 ~ dropPiecesTable ~ error:",
            error,
          );
          reject(error);
        });
    },
  );
}

/**
 * Inserts multiple pieces of data into the 'pieces' table in the provided SQLite database.
 * Filters out pieces with IDs already present in the table and inserts the remaining ones.
 *
 * @param pieces An array of objects representing the pieces to insert.
 * @returns A Promise that resolves if the operation is successful, otherwise rejects with an error.
 */
export function insertMultiplePieces(pieces: IFetchPiecesByIdData[]) {
  return new Promise((resolve, reject) => {
    const mapPieces = new Map<number, IFetchPiecesByIdData>();

    for (const piece of pieces) {
      if (mapPieces.has(piece?.pieceID) === false)
        mapPieces.set(piece?.pieceID, piece);
    }
    const incomingIds = pieces.map((v) => v.pieceID).filter((id) => id != null);
    db.getAllAsync(
      `SELECT pieceID FROM pieces WHERE pieceID IN (${incomingIds})`,
    )
      .then((returnedData) => {
        const setExistingIds = new Set<number>();
        (returnedData as { pieceID: number }[]).forEach((item) => {
          setExistingIds.add(item.pieceID);
        });
        const setIncomingIds = new Set(pieces.map((v) => v.pieceID));
        const notExistingIds = [...setIncomingIds].filter(
          (id) => !setExistingIds.has(id),
        );
        const piecesToInsert = [...mapPieces.values()]
          .filter((v) => notExistingIds.find((id) => id === v.pieceID))
          .map(
            (v) => `
                (
                    ${v.pieceID},
                    '${v.companyID}', 
                    ${v.shipmentID}, 
                    '${v.barcode}', 
                    ${v.packageType},
                    '${v.packageTypeName}',
                    '${v.comments}',
                    '${v.pwBack}',
                    '${v.pod}'
                )`,
          );
        if (notExistingIds.length > 0 && piecesToInsert.length > 0) {
          db.runAsync(
            `
                    INSERT INTO pieces 
                    (
                    pieceID,
                    companyID,
                    shipmentID,
                    barcode,
                    packageType,
                    packageTypeName,
                    comments,
                    pwBack,
                    pod
                    ) 
                    VALUES ${piecesToInsert.join(",")}
                    `,
          )
            .then((_) => {
              resolve({
                message: `Ids inserted correctly`,
                idsInserted: notExistingIds,
              });
            })
            .catch((error) => {
              console.error(
                "🚀 ~ file: pieces.local.queries.ts:108 ~ db.getAllAsync ~ error:",
                error,
              );
              reject(error);
            });
        } else {
          resolve("All ids has been inserted before.");
        }
      })
      .catch((error) => {
        console.error(
          "🚀 ~ file: pieces.local.queries.ts:115 ~ insertMultiplePieces ~ error:",
          error,
        );
      });
  });
}

/**
 * Retrieves an array of pieces associated with a specific shipment ID from the SQLite database.

 * @param params - An object containing the shipment ID.
 * @returns A Promise that resolves to an array of IFetchPiecesByIdData objects, or rejects with an error.
 */
export function getPiecesByShipmentID({ shipmentID }: { shipmentID: number }) {
  return new Promise(
    (resolve: (value: IFetchPiecesByIdData[]) => void, reject) => {
      db.getAllAsync(
        `
            SELECT 
                barcode,
                packageTypeName,
                comments,
                pieceId
            FROM
                pieces
            WHERE
                shipmentID = ?
            `,
        [shipmentID],
      )
        .then((res) => {
          const data = res as IFetchPiecesByIdData[];
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    },
  );
}
