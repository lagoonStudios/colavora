import { db } from "../db";
import { IFetchManifestByIdData } from "@constants/types/manifests";
import { PaginatedData } from "@constants/types/general";


/**
 * Creates the `manifests` table in the SQLite database if it doesn't exist.
 */
export function createManifestsTable() {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.execAsync(
            `
          CREATE TABLE IF NOT EXISTS manifests (
            manifest TEXT PRIMARY KEY UNIQUE NOT NULL,
            companyID TEXT NOT NULL,
            shipmentID INTEGER,
            manifestID INTEGER NOT NULL,
            driverID INTEGER NOT NULL,
            createdDate TEXT,
            is_sync BOOLEAN DEFAULT false,
            last_sync TEXT DEFAULT (datetime('now'))
          );

          CREATE INDEX IF NOT EXISTS manifestDate_idx ON manifests (createdDate);
        `
        ).then(() => {
            resolve("Table created correctly");
        }).catch(error => {
            reject("ERROR Creating manifest table: " + error);
        });
    });
}

/**
 * Inserts multiple manifests into a SQLite database.
 *
 * @param manifests An array of manifest to insert.
 * @returns  A promise that resolves with an object containing a success message and the IDs of the inserted manifests. Rejects with an error message if any errors occur.
 *
 * @throws {Error}  - Rejects with an error if there is a problem with the database operation.
 */
export function insertMultipleManifests(manifests: IFetchManifestByIdData[]) {
    return new Promise((resolve, reject) => {
        const incomingIds = manifests.map(v => v.manifest).filter(id => id != null);
        filterManifestsIds(incomingIds).then((returnedData) => {
            if (returnedData.length > 0) {
                const notExistingManifests = manifests.filter(v => returnedData.find(id => id === v.manifest));
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
                ).then((res) => {
                    resolve({
                        message: `Ids inserted correctly}`,
                        idsInserted: returnedData
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

/**
 * Gets the total count of manifests that have at least one associated shipment with a non-null status.
 *
 * @returns A Promise that resolves to the total count of manifests, or rejects with an error.
 */
export function getAllManifestsCount() {
    return new Promise((resolve: (value: { count: number }) => void, reject) => {
        //`SELECT COUNT(DISTINCT manifests.manifest) AS count FROM manifests INNER JOIN shipments ON manifests.manifest = shipments.manifest WHERE shipments.status IS NOT NULL`
        db.getFirstAsync(`
            SELECT 
                count(DISTINCT shipments.shipmentID) AS count
            FROM 
                shipments
            WHERE 
                shipments.status IS NOT NULL
        `).then((res) => {
            const count = (res as { count: number });
            resolve(count);
        }).catch(error => {
            reject(error);
        });
    });
}

/**
 * Retrieves a paginated list of manifests with their associated active shipments count.

 * @param paginatedData - Pagination parameters (page, page_size).
 * @returns A Promise that resolves to an array of objects containing manifest details, creation date, and active shipments count, or rejects with an error.
 */
export function getManifestsList({ page, page_size }: PaginatedData) {
    return new Promise((resolve: (value: { manifest: string, createdDate: string, active_shipments: number }[]) => void, reject) => {
        db.getAllAsync(`
            SELECT 
                manifests.manifest,
                manifests.createdDate,
                COUNT (CASE WHEN shipments.status IS NOT NULL THEN 1 ELSE 0 END) AS active_shipments
            FROM 
                manifests
            INNER JOIN shipments ON 
                manifests.manifest = shipments.manifest
            GROUP BY manifests.manifest
            ORDER BY 
                manifests.createdDate DESC
            LIMIT ${page_size} OFFSET ${page * page_size}
            `).then((res) => {
            const data = res as { manifest: string, createdDate: string, active_shipments: number }[];
            resolve(data);
        }).catch(error => {
            console.error("🚀 ~ getManifestsList ~ error:", error);
            reject(error);
        });
    });
}

/**
  * Checks if the manifests IDs exist in the database and returns the ones that don't.
 * @param ids the manifests IDs to check.
 * @returns a promise that resolves with an array of manifests IDs that don't exist in the database.
 */
export function filterManifestsIds(ids: string[]) {
    return new Promise((resolve: (value: string[]) => void, reject) => {
        db.getAllAsync(`SELECT manifest FROM manifests WHERE manifest IN (${ids.map(v => '?').join(',')})
        `, [...ids]).then((data) => {
            try {
                const responseData = data as { manifest: string }[];
                const setIncomingIds = new Set(ids);
                const setExistingIds = new Set<string>();
                responseData.forEach(item => setExistingIds.add(item.manifest));
                const notExistingIds = [...setIncomingIds].filter(id => !setExistingIds.has(id));
                resolve(notExistingIds)
            } catch (error) {
                console.error("🚀 ~ filterManifestsIds ~ error:", error);
                reject(error);
            }
        }).catch(error => {
            console.error("🚀 ~ filterManifestsIds ~ error:", error);
            reject(error);
        });
    });


}