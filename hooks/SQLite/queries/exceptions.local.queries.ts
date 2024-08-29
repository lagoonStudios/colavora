import { IReasonsByIdData } from "@constants/types/general";
import { db } from "../db";

/**
 * Creates an 'exceptions' table in the provided SQLite database if it doesn't exist.
 * @returns A Promise that resolves with "exceptions Table created correctly" if successful, or rejects with an error message.
 */
export function createExceptionsTable() {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.execAsync(
            `
        CREATE TABLE IF NOT EXISTS exceptions (
            reasonID INTEGER PRIMARY KEY UNIQUE,
            companyID TEXT,
            customerID INTEGER,
            reasonCode TEXT,
            reasonDesc TEXT,
            reasonCodeDesc TEXT,
            completeOrder BOOLEAN,
            is_sync BOOLEAN DEFAULT false,
            last_sync TEXT DEFAULT (datetime('now'))
        );
        `
        ).then(() => {
            resolve("exceptions Table created correctly");
        }).catch(error => {
            console.error("🚀 ~ file: exceptions.local.queries.ts:27 ~ createExceptionsTable ~ error:", error);
            reject("ERROR Creating exceptions table: " + error);
        });
    });
}

export function dropExceptionsTable() {
    return new Promise((resolve: ({ status, message }: { status: number, message: string }) => void, reject) => {
        db.execAsync(`DROP TABLE IF EXISTS exceptions;`)
            .then(() => {
                resolve({
                    status: 200,
                    message: "Table dropped correctly"
                });
            }).catch(error => {
                console.error("🚀 ~ file: exceptions.local.queries.ts:44 ~ dropExceptionsTable ~ error:", error);
            });
    });
};

/**
 * Inserts multiple exception entries into the provided SQLite database, handling duplicates.
 *
 * The function first checks for existing `reasonID` values to avoid duplicate insertions.
 * It then inserts only the entries with non-existing `reasonID` values.
 *
 * @param exceptions - An array of objects representing exception data. Each object should have the following properties:
 * @returns A Promise that resolves with an object containing:
 * Rejects with an error message on failure.
 */
export function insertMultipleExceptions(exceptions: IReasonsByIdData[]) {
    return new Promise((resolve, reject) => {
        const setIncomingIds = new Set(exceptions.map(v => v.reasonID));
        db.getAllAsync(`
        SELECT reasonID FROM exceptions WHERE reasonID IN (${[...setIncomingIds]});
        `).then((data) => {
            const responseData = data as { reasonID: number }[];
            const setExistingIds = new Set<number>();
            responseData.forEach(item => setExistingIds.add(item.reasonID));

            const notExistingIds = [...setIncomingIds].filter(id => !setExistingIds.has(id));
            if (notExistingIds.length > 0) {
                const noExistingExceptions = exceptions.filter(v => (notExistingIds.find(id => id === v.reasonID)));

                db.runAsync(`
                    INSERT INTO exceptions 
                    (
                        reasonID,
                        companyID,
                        customerID,
                        reasonCode,
                        reasonDesc,
                        reasonCodeDesc,
                        completeOrder
                    ) 
                    VALUES 
                    ${noExistingExceptions.map(v =>
                    `(
                            ${v.reasonID}, 
                            '${v.companyID}', 
                            ${v.customerID}, 
                            '${v.reasonCode}', 
                            '${v.reasonDesc}', 
                            '${v.reasonCodeDesc}', 
                            ${v.completeOrder}
                        )`
                ).join(',')};
                    `,
                ).then((_) => {
                    resolve({
                        message: `Exceptions inserted correctly}`,
                        idsInserted: notExistingIds
                    });
                }).catch(error => {
                    console.error("🚀 ~ insertMultipleExceptions ~ error:", error);
                    reject(error);
                });
            } else {
                reject("All exceptions has been inserted before.")
            }
        });
    })
}

/**
 * Retrieves all exception records from the provided SQLite database.
 * @returns A Promise that resolves to an array of IReasonsByIdData objects, or rejects with an error.
 */
export function getAllExceptions() {
    return new Promise((resolve: (value: IReasonsByIdData[]) => void, reject) => {
        db.getAllAsync(`
            SELECT 
                reasonID,
                companyID,
                customerID,
                reasonCode,
                reasonDesc,
                reasonCodeDesc,
                completeOrder
            FROM 
                exceptions
            `)
            .then((res) => {
                const data = res as IReasonsByIdData[];
                resolve(data);
            }).catch(error => {
                console.error("🚀 ~ getAllExceptions ~ error:", error);
                reject(error);
            });
    })
};