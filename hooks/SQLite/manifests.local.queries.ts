import { IFetchManifestByIdData } from "@constants/types/manifests";
import { SQLiteDatabase } from "expo-sqlite";


/**
 * Creates the `manifests` table in the SQLite database if it doesn't exist.

 * @param  db The SQLite database connection.
 */
export function createManifestsTable(db: SQLiteDatabase) {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.execAsync(
            `
            DROP TABLE IF EXISTS manifests;
          CREATE TABLE IF NOT EXISTS manifests (
            manifest TEXT PRIMARY KEY UNIQUE NOT NULL,
            companyID TEXT NOT NULL,
            shipmentID INTEGER,
            manifestID INTEGER NOT NULL,
            driverID INTEGER NOT NULL,
            createdDate TEXT,
            is_sync BOOLEAN NOT NULL CHECK (is_sync IN (0,1) ) DEFAULT 0,
            last_sync TEXT
          );
        `
        ).then(() => {
            resolve("Table created correctly");
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * Inserts multiple manifests into a SQLite database.
 *
 * @param  db The SQLite database connection.
 * @param manifests An array of manifest to insert.
 * @returns  A promise that resolves with an object containing a success message and the IDs of the inserted manifests. Rejects with an error message if any errors occur.
 *
 * @throws {Error}  - Rejects with an error if there is a problem with the database operation.
 */
export function insertMultipleManifests(db: SQLiteDatabase, manifests: IFetchManifestByIdData[]) {
    return new Promise((resolve, reject) => {
        const incomingIds = manifests.map(v => v.manifest).filter(id => id != null);
        db.getAllAsync(`SELECT manifest FROM manifests WHERE manifest IN (${incomingIds})`).then((returnedData) => {
            const setExistingIds = new Set<string>();
            (returnedData as { manifest: string }[]).forEach(item => {
                setExistingIds.add(item.manifest);
            });
            const setIncomingIds = new Set(manifests.map(v => v.manifest));
            const notExistingIds = [...setIncomingIds].filter(id => !setExistingIds.has(id));

            if (notExistingIds.length > 0) {
                const notExistingManifests = manifests.filter(v => !setExistingIds.has(v.manifest));
                db.runAsync(`
                INSERT INTO manifests (
                manifest,
                companyID,
                shipmentID,
                manifestID,
                driverID,
                createdDate
                ) VALUES ${notExistingManifests.map(v => `('${v.manifest}', '${v.companyID}', ${v.shipmentID}, ${v.manifestID}, ${v.driverID}, datetime('${v.createdDate}'))`).join(',')};
                `,
                    notExistingIds
                ).then((res) => {
                    resolve({
                        message: `Ids inserted correctly}`,
                        idsInserted: notExistingIds
                    });
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject("All ids has been inserted before.")
            }
        }).catch(error => {
            reject(error);
        });
    })
};
