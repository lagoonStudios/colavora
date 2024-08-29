import { db } from "../db";
import { ICODData } from "@constants/types/general";


/**
 * Creates a 'cod' table in the provided SQLite database if it doesn't exist.
 *
 * @returns A Promise that resolves with "Table created correctly" if successful, or rejects with an error message.
 */
export function createCODTable() {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.execAsync(
            `
        CREATE TABLE IF NOT EXISTS cod (
            codTypeID INTEGER PRIMARY KEY UNIQUE NOT NULL,
            codType TEXT,
            companyID TEXT NOT NULL,
            is_sync BOOLEAN DEFAULT false,
            last_sync TEXT DEFAULT (datetime('now'))
          );
        `
        ).then(() => {
            resolve("Table created correctly");
        }).catch(error => {
            console.error("🚀 ~ file: cod.local.queries.ts:25 ~ createCODTable ~ error:", error);
            reject("ERROR Creating cod table: " + error);
        });
    });
}

export function dropCODTable() {
    return new Promise((resolve: ({ status, message }: { status: number, message: string }) => void, reject) => {
        db.execAsync(`DROP TABLE IF EXISTS cod;`)
            .then(() => {
                resolve({
                    status: 200,
                    message: "Table dropped correctly"
                });
            }).catch(error => {
                console.error("🚀 ~ file: cod.local.queries.ts:44 ~ dropCODTable ~ error:", error);
                reject(error)
            });
    });
};

/**
 * Inserts multiple COD entries into the provided SQLite database.
 *
 * The function first checks for existing `codTypeID` values in the database to avoid duplicate insertions.
 * It then inserts only the entries with non-existing `codTypeID` values.
 *
 * @param codIds - An array of objects representing COD data. Each object should have the following properties:
 * @returns A Promise that resolves with an object containing:
 * Rejects with an error message on failure.
 */
export function insertMultipleCOD(codIds: ICODData[]) {
    return new Promise((resolve: (value: { message: string, idsInserted: number[] }) => void, reject) => {
        const incomingIds = new Set(codIds.map(v => v.codTypeID));
        db.getAllAsync(`
            SELECT codTypeID FROM cod WHERE codTypeID IN (${[...incomingIds]});
        `).then((data) => {
            const responseData = data as { codTypeID: number }[];
            const setExistingIds = new Set<number>(responseData.map(v => v.codTypeID));
            const notExistingIds = [...incomingIds].filter(id => !setExistingIds.has(id));
            if (notExistingIds.length > 0) {
                const codsToInsert = codIds.filter((v) =>
                    notExistingIds.find(id => id === v.codTypeID)
                ).map(v => `
                    (
                        ${v.codTypeID},
                        '${v.codType}',
                        '${v.companyID}'
                    )`).join(',');


                db.runAsync(`
                    INSERT INTO cod
                        (
                        codTypeID,
                        codType,
                        companyID
                        )
                    VALUES
                        ${codsToInsert}
                    `)
                    .then((_) => {
                        resolve({
                            message: `Ids inserted correctly}`,
                            idsInserted: notExistingIds
                        });
                    }).catch(error => {
                        console.error("🚀 ~ insertMultipleCOD ~ error:", error);
                        reject(error);
                    });
            } else {
                reject("All CODS ids has been inserted before.")
            };
        }).catch(error => {
            console.error("🚀 ~ insertMultipleCOD ~ error:", error);
            reject(error);
        });;

    })
};

/**
 * Retrieves all COD records from the provided SQLite database.
 *
 * @returns A Promise that resolves to an array of ICODData objects,
 *                               or rejects with an error.
 */
export function getAllCOD() {
    return new Promise((resolve: (value: ICODData[]) => void, reject) => {
        db.getAllAsync(`
            SELECT 
                codTypeID,
                codType,
                companyID
            FROM 
                cod
            `)
            .then((res) => {
                const data = res as ICODData[];
                resolve(data);
            }).catch(error => {
                reject(error);
            });
    });
};