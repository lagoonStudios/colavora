/* eslint-disable prettier/prettier */
import { db } from "../db";
import { IFetchShipmentByIdData } from "@constants/types/shipments";
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
                status TEXT,
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
            reject("ERROR Creating shipments table: " + error);
        });
    });

}

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
            const setExistingIds = new Set<number>();
            returnedData.forEach(item => setExistingIds.add(item));

            const setIncomingIds = new Set(shipments.map(v => v.shipmentID!));
            const notExistingIds = [...setIncomingIds].filter(id => !setExistingIds.has(id));
            if (notExistingIds.length > 0) {
                const shipmentsToInsert = shipments.filter((v) =>
                    notExistingIds.find(id => id === v.shipmentID)
                ).map(v => `
                    (
                        '${v.companyID}', 
                        ${v.shipmentID}, 
                        '${v.waybill}', 
                        ${v.serviceType},
                        '${v.serviceTypeName}',
                        ${v.packageType},
                        datetime('${v.readyDate?.replace("T", " ")}'),
                        datetime('${v.dueDate?.replace("T", " ")}'),
                        '${v.codType}',
                        ${v.codAmount},
                        '${v.sender}',
                        '${v.senderName}',
                        '${v.senderAddressLine1}',
                        '${v.senderAddressLine2}',
                        '${v.senderZip}',
                        '${v.senderPhoneNumber}',
                        '${v.senderContactPerson}',
                        '${v.orderNotes}',
                        '${v.consigneeNum}',
                        '${v.consigneeName}',
                        '${v.addressLine1}',
                        '${v.addressLine2}',
                        '${v.zip}',
                        '${v.phoneNumber}',
                        '${v.contactPerson}',
                        ${v.createdUserID},
                        datetime('${v.createdDate?.replace("T", " ")}'),
                        datetime('${v.lastTransferDate?.replace("T", " ")}'),
                        '${v.status}',
                        ${v.qty},
                        '${v.items}',
                        ${v.templateID},
                        '${v.manifestDL}',
                        '${v.manifestPk}',
                        '${v.manifestPk}',
                        ${v.assignPK},
                        ${v.assignDL},
                        '${v.division}',
                        '${v.lastEventComment}',
                        '${v.reason}',
                        '${v.barcode}',
                        '${v.referenceNo}'
                    )`)
                db.runAsync(`
                    INSERT INTO shipments 
                    (
                    companyID ,
                    shipmentID ,
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
                    notExistingIds
                ).then((res) => {
                    resolve({
                        message: `Ids inserted correctly}`,
                        idsInserted: notExistingIds
                    });
                }).catch(error => {
                    console.error("🚀 ~ insertMultipleShipments ~ error:", error);
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
    return new Promise((resolve: (value: { count: number, completed_count: number }) => void, reject) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endToday = new Date();
        endToday.setHours(23, 59, 59, 999);
        db.getFirstAsync(`
            SELECT 
                count(DISTINCT shipments.shipmentID) AS count,
                SUM(
                    CASE WHEN shipments.status = 'COMPLETED' THEN 1 ELSE 0 END
                ) AS completed_count
            FROM 
                shipments
            INNER JOIN manifests ON 
                shipments.manifest = manifests.manifest
            WHERE 
                shipments.status IS NOT NULL 
            AND 
                shipments.dueDate >= datetime('${today.toISOString()}')
            AND 
                shipments.dueDate <= datetime('${endToday.toISOString()}')
            `)
            .then((res) => {
                const data = res as { count: number, completed_count: number };
                resolve(data);
            })
            .catch(error => {
                console.error("🚀 ~ getTodaysShipments ~ error:", error);
                reject(error);
            });

    });
};

/**
 * Retrieves an array of shipment list items associated with a specific manifest ID from the SQLite database.

 * @param params - An object containing the manifest ID.
 * @returns A Promise that resolves to an array of IFetchOrderListItem objects, or rejects with an error.
 */
export function getShipmentListItemByManifestID({ manifestID }: { manifestID: string }) {
    return new Promise((resolve: (value: IFetchOrderListItem[]) => void, reject) => {
        db.getAllAsync(`
            SELECT 
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
            `, [manifestID])
            .then((res) => {
                const data = res as IFetchOrderListItem[];
                resolve(data);
            }).catch(error => {
                console.error("🚀 ~ getShipmentListItemByManifestID ~ error:", error);
                reject(error);
            });
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
 * @param ids the sipmend IDs to check.
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