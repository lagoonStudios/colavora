import { IFetchShipmentByIdData } from "@constants/types/shipments";
import * as SQLite from "expo-sqlite";

/**
 * Creates the `shipments` table in the SQLite database if it doesn't exist.

 * @param db The SQLite database connection.
 */
export function createShipmentTable(db: SQLite.SQLiteDatabase) {
    try {
        db.execSync(
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
            manifestPk TEXT,
            assignPK INTEGER,
            assignDL INTEGER,
            division TEXT,
            lastEventComment TEXT,
            reason TEXT,
            barcode TEXT,
            referenceNo TEXT
            );
        `
        );
    } catch (error) {
        console.error(error);
    }
}

/**
 * Inserts multiple shipments into a SQLite database.
 *
 * @param db The SQLite database connection.
 * @param shipments An array of shipment objects to insert 
 * @see {@link IFetchShipmentByIdData}.
 * @returns  A promise that resolves with an object containing a success message and the IDs of the inserted shipments. Rejects with an error message if any errors occur.
 *
 * @throws {Error}  - Rejects with an error if there is a problem with the database operation.
 */
export function insertMultipleShipments(db: SQLite.SQLiteDatabase, shipments: IFetchShipmentByIdData[]) {
    return new Promise((resolve, reject) => {
        const incomingIds = shipments.map(v => v.shipmentID);
        db.getAllAsync(`SELECT shipmentID FROM shipments WHERE shipmentID IN (${incomingIds})`).then((returnedData) => {
            const setExistingIds = new Set<number>();
            (returnedData as { shipmentID: number }[]).forEach(item => {
                setExistingIds.add(item.shipmentID);
            });
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
                        mesasge: `Ids inserted correctly}`,
                        idsInserted: notExistingIds
                    });
                }).catch(error => {
                    console.error(error);
                    reject(error);
                });
            } else {
                reject("All ids has been inserted before.")
            }
        })
    });
};