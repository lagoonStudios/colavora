import { db } from "../db";
import { IFetchShipmentByIdData, ShipmentStatus } from "@constants/types/shipments";
import { IFetchOrderListItem } from "../SQLite.types";

/**
 * Creates the `shipments` table in the SQLite database if it doesn't exist.
 */
export function createShipmentTable() {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.execAsync(
            `
                CREATE TABLE IF NOT EXISTS shipments (
                companyID TEXT NOT NULL,
                shipmentID INTEGER PRIMARY KEY UNIQUE,
                waybill TEXT,
                serviceType INTEGER,
                ServiceTypeName TEXT,
                packageType INTEGER,
                readyDate TEXT,
                dueDate TEXT,
                codType TEXT,
                codAmount REAL,
                sender TEXT,
                senderName TEXT,
                senderAddressLine1 TEXT,
                senderAddressLine2 TEXT,
                senderZip TEXT,
                senderPhoneNumber TEXT,
                senderContactPerson TEXT,
                orderNotes TEXT,
                consigneeNum TEXT,
                consigneeName TEXT,
                addressLine1 TEXT,
                addressLine2 TEXT,
                zip TEXT,
                phoneNumber TEXT,
                contactPerson TEXT,
                createdUserID INTEGER,
                createdDate TEXT,
                lastTransferDate TEXT,
                status TEXT NOT NULL,
                qty INTEGER,
                items TEXT,
                templateID INTEGER,
                manifestDL TEXT,
                assignPK INTEGER,
                assignDL INTEGER,
                division TEXT,
                lastEventComment TEXT,
                reason TEXT,
                barcode TEXT,
                referenceNo TEXT,
                manifestPk TEXT,
                manifest TEXT NOT NULL,
                is_sync BOOLEAN DEFAULT false,
                last_sync TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (manifest) REFERENCES manifests (manifest)
                    ON DELETE CASCADE
                );

                CREATE INDEX IF NOT EXISTS shipments_manifests_idx ON shipments (manifest);
                CREATE INDEX IF NOT EXISTS shipments_statuses_idx ON shipments (status);
                CREATE INDEX IF NOT EXISTS shipments_dueDate_idx ON shipments (dueDate);
            `
        ).then(() => {
            resolve("Table created correctly");
        }).catch(error => {
            console.error("🚀 ~ file: shipments.local.queries.ts:68 ~ createShipmentTable ~ error:", error);
            reject("ERROR Creating shipments table: " + error);
        });
    });

}

export function dropShipmentTable() {
    return new Promise((resolve: ({ status, message }: { status: number, message: string }) => void, reject) => {
        db.execAsync(`DROP TABLE IF EXISTS shipments;`)
            .then(() => {
                resolve({
                    status: 200,
                    message: "Table dropped correctly"
                });
            }).catch(error => {
                console.error("🚀 ~ file: shipments.local.queries.ts:44 ~ dropShipmentTable ~ error:", error);
                reject(error)
            });
    });
};

/**
 * Inserts multiple shipments into a SQLite database.
 *
 * @param shipments An array of shipment objects to insert 
 * @see {@link IFetchShipmentByIdData}.
 * @returns  A promise that resolves with an object containing a success message and the IDs of the inserted shipments. Rejects with an error message if any errors occur.
 *
 * @throws {Error}  - Rejects with an error if there is a problem with the database operation.
 */
export function insertMultipleShipments(shipments: IFetchShipmentByIdData[]) {
    return new Promise((resolve, reject) => {
        const incomingIds = shipments.map(v => v.shipmentID).filter(id => id != null);
        filterShipmentIds(incomingIds).then((returnedData) => {

            if (returnedData.length > 0) {
                const shipmentsToInsert = shipments.filter((v) =>
                    returnedData.find(id => id === v.shipmentID)
                ).map(v => `
                    (
                        '${String(v.companyID)}', 
                        ${Number(v.shipmentID)}, 
                        '${String(v.waybill)}', 
                        ${Number(v.serviceType)},
                        '${String(v.serviceTypeName)}',
                        ${Number(v.packageType)},
                        datetime('${String(v.readyDate)?.replace("T", " ")}'),
                        datetime('${String(v.dueDate)?.replace("T", " ")}'),
                        '${String(v.codType)}',
                        ${Number(v.codAmount)},
                        '${String(v.sender)}',
                        '${String(v.senderName)}',
                        '${String(v.senderAddressLine1)}',
                        '${String(v.senderAddressLine2)}',
                        '${String(v.senderZip)}',
                        '${String(v.senderPhoneNumber)}',
                        '${String(v.senderContactPerson)}',
                        '${String(v.orderNotes)}',
                        '${String(v.consigneeNum)}',
                        '${String(v.consigneeName)}',
                        '${String(v.addressLine1)}',
                        '${String(v.addressLine2)}',
                        '${String(v.zip)}',
                        '${String(v.phoneNumber)}',
                        '${String(v.contactPerson)}',
                        ${String(v.createdUserID)},
                        datetime('${String(v.createdDate)?.replace("T", " ")}'),
                        datetime('${String(v.lastTransferDate)?.replace("T", " ")}'),
                        '${String(v.status)}',
                        ${Number(v.qty)},
                        '${String(v.items)}',
                        ${Number(v.templateID)},
                        '${String(v.manifestDL)}',
                        '${String(v.manifestPk)}',
                        '${String(v.manifestPk)}',
                        ${Number(v.assignPK)},
                        ${Number(v.assignDL)},
                        '${String(v.division)}',
                        '${String(v.lastEventComment)}',
                        '${String(v.reason)}',
                        '${String(v.barcode)}',
                        '${String(v.referenceNo)}'
                    )`)
                db.runAsync(`
                    INSERT INTO shipments 
                    (
                    companyID,
                    shipmentID,
                    waybill,
                    serviceType,
                    ServiceTypeName,
                    packageType,
                    readyDate,
                    dueDate,
                    codType,
                    codAmount,
                    sender,
                    senderName,
                    senderAddressLine1,
                    senderAddressLine2,
                    senderZip,
                    senderPhoneNumber,
                    senderContactPerson,
                    orderNotes,
                    consigneeNum,
                    consigneeName,
                    addressLine1,
                    addressLine2,
                    zip,
                    phoneNumber,
                    contactPerson,
                    createdUserID,
                    createdDate,
                    lastTransferDate,
                    status,
                    qty,
                    items,
                    templateID,
                    manifestDL,
                    manifestPk,
                    manifest,
                    assignPK,
                    assignDL,
                    division,
                    lastEventComment,
                    reason,
                    barcode,
                    referenceNo
                    ) 
                    VALUES ${shipmentsToInsert.join(',')};
                    `,
                ).then(() => {
                    resolve({
                        message: `Ids inserted correctly`,
                        idsInserted: returnedData
                    });
                }).catch(error => {
                    console.error("🚀 ~ file: shipments.local.queries.ts:207 ~ insertMultipleShipments ~ error:", error);
                    reject(error);
                });
            } else {
                reject("All ids has been inserted before.")
            }
        })
    });
};


/**
 * Gets the count and completed count of shipments for the current day.
 *
 * @returns A Promise that resolves to an object containing the total count of shipments and the count of completed shipments for the current day, or rejects with an error.
 */
export function getTodaysShipments() {
    return new Promise((resolve: (value: { count: number }) => void, reject) => {
        const endToday = new Date();
        endToday.setHours(23, 59, 59, 999);
        db.getFirstAsync(`
            SELECT 
                count(DISTINCT shipments.shipmentID) AS count
            FROM 
                shipments
            WHERE 
                shipments.status IS NOT NULL
            AND 
                shipments.dueDate <= datetime('${endToday.toISOString()}')
            `)
            .then((res) => {
                const data = res as { count: number };
                resolve(data);
            })
            .catch(error => {
                console.error("🚀 ~ file: shipments.local.queries.ts:237 ~ getTodaysShipments ~ error:", error);
                reject(error);
            });

    });
};

/**
 * Retrieves an array of shipment list items associated with a specific manifest ID from the SQLite database.

 * @param params - An object containing the manifest ID.
 * @returns A Promise that resolves to an array of IFetchOrderListItem objects, or rejects with an error.
 */
export function getShipmentList({ manifestID }: { manifestID?: string }) {
    return new Promise((resolve: (value: IFetchOrderListItem[]) => void, reject) => {
        if (manifestID) {
            db.getAllAsync(`
            SELECT 
                shipmentID,
                consigneeName,
                zip,
                senderName,
                serviceTypeName,
                addressLine1,
                addressLine2,
                referenceNo,
                qty
            FROM 
                shipments
            WHERE 
                manifestPK = ?;
            AND
                status IS NOT NULL
            `, [manifestID])
                .then((res) => {
                    const data = res as IFetchOrderListItem[];
                    resolve(data);
                }).catch(error => {
                    console.error("🚀 ~ getShipmentListItemByManifestID ~ error:", error);
                    reject(error);
                });
        } else {
            db.getAllAsync(`
                SELECT 
                    shipmentID,
                    consigneeName,
                    zip,
                    senderName,
                    serviceTypeName,
                    addressLine1,
                    addressLine2,
                    referenceNo,
                    qty
                FROM 
                    shipments                    
                WHERE
                    status IS NOT NULL
                `,)
                .then((res) => {
                    const data = res as IFetchOrderListItem[];
                    resolve(data);
                }).catch(error => {
                    console.error("🚀 ~ getShipmentListItemByManifestID ~ error:", error);
                    reject(error);
                });
        }
    });

}

/**
 * Retrieves shipment details by shipment ID from the SQLite database.
 * @param params - An object containing the shipment ID.
 * @returns A Promise that resolves to a partial object of IFetchShipmentByIdData, or rejects with an error.
 */
export function getShipmenDetailsById({ shipmentID }: { shipmentID: number }) {
    return new Promise((resolve: (value: Partial<IFetchShipmentByIdData>) => void, reject) => {
        db.getFirstAsync(`
            SELECT
                consigneeName,
                zip,
                senderName,
                serviceTypeName,
                addressLine1,
                addressLine2,
                phoneNumber,
                dueDate,
                status,
                waybill,
                waybill,
                serviceTypeName,
                qty,
                codAmount
            FROM
                shipments
            WHERE
                shipmentID = ?
            `, [shipmentID])
            .then((res) => {
                const data = res as Partial<IFetchShipmentByIdData>;
                resolve(data);
            }).catch(error => {
                console.error("🚀 ~ getShipmenDetailsById ~ error:", error);
                reject(error);
            });
    });
}

/**
 * Checks if the shipment IDs exist in the database and returns the ones that don't.
 * @param ids the shipments IDs to check.
 * @returns a promise that resolves with an array of shipment IDs that don't exist in the database.
 */
export function filterShipmentIds(ids: number[]) {
    return new Promise((resolve: (value: number[]) => void, reject) => {
        db.getAllAsync(`SELECT shipmentID FROM shipments WHERE shipmentID IN (${ids.map(v => '?').join(',')})
        `, [...ids]).then((data) => {
            try {
                const responseData = data as { shipmentID: number }[];
                const setIncomingIds = new Set(ids);
                const setExistingIds = new Set<number>();
                responseData.forEach(item => setExistingIds.add(item.shipmentID));
                const notExistingIds = [...setIncomingIds].filter(id => !setExistingIds.has(id));
                resolve(notExistingIds)
            } catch (error) {
                console.error("🚀 ~ filterShipmentIds ~ error:", error);
                reject(error);
            }

        }).catch(error => {
            console.error("🚀 ~ filterShipmentIds ~ error:", error);
            reject(error);
        });
    });
}

/**
 * Updates the status of a shipment in the database.
 * @param  options.shipmentId - The unique identifier of the shipment to update.
 * @param  options.status - The new status for the shipment.
 * @returns A Promise that resolves with a success message if the update is successful, or rejects with an error message if the update fails.
 */
export function updateShipmentStatus({ shipmentId, status }: { shipmentId: number, status: ShipmentStatus }) {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.runAsync(`
            UPDATE shipments
            SET status = $status
            WHERE shipmentID = $shipmentId
        `, { $status: status, $shipmentId: shipmentId })
            .then((res) => {
                if (res.changes === 0) {
                    console.error("🚀 ~ updateShipmentStatus ~ shipmentId not found:");
                    reject("shipmentId not found");
                    return;
                }

                resolve("Status updated correctly");
            }).catch(error => {
                console.error("🚀 ~ updateShipmentStatus ~ error:", error);
                reject(error);
            });

    });
}