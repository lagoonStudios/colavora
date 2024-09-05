import { db } from "../db";
import { IFetchManifestByIdData } from "@constants/types/manifests";
import { PaginatedData } from "@constants/types/general";
import { ShipmentStatus } from "@constants/types/shipments";


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
            driverID INTEGER,
            createdDate TEXT,
            is_sync BOOLEAN DEFAULT false,
            last_sync TEXT DEFAULT (datetime('now'))
          );

          CREATE INDEX IF NOT EXISTS manifestDate_idx ON manifests (createdDate);
        `
        ).then(() => {
            resolve("Table created correctly");
        }).catch(error => {
            console.error("🚀 ~ file: manifests.local.queries.ts:27 ~ createManifestsTable ~ error:", error);
            reject("ERROR Creating manifest table: " + error);
        });
    });
}

export function dropManifestTable() {
    return new Promise((resolve: ({ status, message }: { status: number, message: string }) => void, reject) => {
        db.execAsync(`DROP TABLE IF EXISTS manifests;`)
            .then(() => {
                resolve({
                    status: 200,
                    message: "Table dropped correctly"
                });
            }).catch(error => {
                console.error("🚀 ~ file: manifests.local.queries.ts:44 ~ dropManifestTable ~ error:", error);
                reject(error)
            });
    });
};

/**
 * Inserts multiple manifests into a SQLite database.
 *
 * @param manifests An array of manifest to insert.
 * @returns  A promise that resolves with an object containing a success message and the IDs of the inserted manifests. Rejects with an error message if any errors occur.
 *
 * @throws {Error}  - Rejects with an error if there is a problem with the database operation.
 */
export function insertMultipleManifests(manifests: IFetchManifestByIdData[]) {
    return new Promise((resolve: (value: { message: string, idsInserted: string[] }) => void, reject) => {
        const incomingIds = manifests.map(v => v.manifest).filter(id => id != null);
        filterManifestsIds(incomingIds).then((returnedData) => {
            if (returnedData.length > 0) {
                const notExistingManifests = manifests.filter(v => returnedData.find(id => id === v.manifest));
                db.runAsync(`
                INSERT INTO manifests (
                manifest,
                companyID,
                driverID,
                createdDate
                ) VALUES ${notExistingManifests.map(v => `('${v.manifest}', '${v.companyID}', ${v.driverID}, datetime('${v.createdDate}'))`).join(',')};
                `,
                ).then(() => {
                    resolve({
                        message: `Ids inserted correctly`,
                        idsInserted: returnedData
                    });
                }).catch(error => {
                    console.error("🚀 ~ file: manifests.local.queries.ts:68 ~ insertMultipleManifests ~ error:", error);
                    reject(error);
                });
            } else {
                resolve({
                    message: `All ids has been inserted before.`,
                    idsInserted: returnedData
                });
            }
        }).catch(error => {
            console.error("🚀 ~ file: manifests.local.queries.ts:75 ~ filterManifestsIds ~ error:", error);
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
        db.getFirstAsync(`
        SELECT
            COUNT(DISTINCT manifests.manifest) as count,
            COUNT(DISTINCT shipments.shipmentID) AS shipment_count
        FROM
            manifests
        INNER JOIN shipments ON
            (manifests.manifest = shipments.manifestPK OR manifests.manifest = shipments.manifestDL)
        WHERE
            shipments.status IS NOT NULL
            AND shipments.status NOT IN ('${ShipmentStatus.COMPLETED}', '${ShipmentStatus.CANCELLED}', '${ShipmentStatus.PARTIAL_DELIVERY}', '${ShipmentStatus.DELIVERED}')
        HAVING
            shipment_count > 0;
        `).then((res) => {
            const data = (res as { count: number, shipment_count: number });
            resolve({ count: data.count });
        }).catch(error => {
            console.error("🚀 ~ file: manifests.local.queries.ts:120 ~ getAllManifestsCount ~ error:", error);
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
                COUNT (
                    CASE WHEN
                        shipments.status IS NOT NULL
                    AND 
                        shipments.status NOT IN ('${ShipmentStatus.COMPLETED}', '${ShipmentStatus.CANCELLED}', '${ShipmentStatus.PARTIAL_DELIVERY}', '${ShipmentStatus.DELIVERED}')
                    THEN 1 ELSE 0 END
                    ) AS active_shipments
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
        db.getAllAsync(`SELECT manifest FROM manifests WHERE manifest IN (${ids.map(() => '?').join(',')})
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

/**
 * Retrieves all the manifest IDs from the 'manifests' table.
 * @returns A promise that resolves to an array of manifest IDs.
 */
export function getAllManifestIds() {
    return new Promise((resolve: (value: number[]) => void, reject) => {
        db.getAllAsync(`
            SELECT manifest FROM manifests
            `).then((res) => {
            const manifestIds: { manifest: string }[] = res as { manifest: string }[];
            resolve(manifestIds?.map(({ manifest }) => Number(manifest)))
        }).catch(error => {
            reject(error);
        });
    });
}