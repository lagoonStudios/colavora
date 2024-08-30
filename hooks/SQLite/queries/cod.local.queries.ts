import { db } from "../db";
import { ICODData, Language } from "@constants/types/general";


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
            lang TEXT NOT NULL,
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
export function insertMultipleCOD(cods: ICODData[]) {
    return new Promise((resolve: (value: { message: string, idsInserted: number[] }) => void, reject) => {
        filterDuplicatedCODS(cods).then(({ notExistingIds }) => {
            if (notExistingIds.length > 0) {
                const codsToInsert = cods.filter((v) =>
                    notExistingIds.find(id => id === v.codTypeID)
                ).map(v => `
                        (
                            ${v.codTypeID},
                            '${v.codType}',
                            '${v.companyID}',
                            '${v.lang}'
                        )`).join(',');


                db.runAsync(`
                        INSERT INTO cod
                            (
                            codTypeID,
                            codType,
                            companyID,
                            lang
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
            console.error("🚀 ~ file: cod.local.queries.ts:45 ~ filterDuplicatedCODS ~ error:", error);
            reject(error);
        })
    })
};

/**
 * Retrieves all COD records from the provided SQLite database by language.
 *
 * @returns A Promise that resolves to an array of ICODData objects, or rejects with an error.
 */
export function getAllCODByLang(lang: Language) {
    return new Promise((resolve: (value: ICODData[]) => void, reject) => {
        db.getAllAsync(`
            SELECT 
                codTypeID,
                codType,
                companyID,
                lang
            FROM 
                cod
            WHERE
                lang = ?
            `, [lang])
            .then((res) => {
                const data = res as ICODData[];
                resolve(data);
            }).catch(error => {
                console.error("🚀 ~ file: cod.local.queries.ts:104 ~ getAllCOD ~ error:", error);
                reject(error);
            });
    });
};


/**
 * Asynchronously filters out COD type IDs from the provided `cods` array that already exist in the database.
 *
 * @param  cods - An array of objects representing COD data, each containing a `codTypeID` property.
 * @returns A promise that resolves to an object with two properties:
 *   - `existingIds`: An array of COD type IDs that already exist in the database.
 *   - `notExistingIds`: An array of COD type IDs that do not exist in the database.
 * @throws Rejects the promise with an error if there's a problem accessing the database.
 */
export function filterDuplicatedCODS(cods: ICODData[]) {
    return new Promise((resolve: (value: { existingIds: number[], notExistingIds: number[] }) => void, reject) => {
        const incomingIds = new Set(cods.map(v => v.codTypeID));
        db.getAllAsync(`
            SELECT codTypeID FROM cod WHERE codTypeID IN (${[...incomingIds]});
        `).then((data) => {
            const responseData = data as { codTypeID: number }[];
            const setExistingIds = new Set<number>(responseData.map(v => v.codTypeID));
            const notExistingIds = [...incomingIds].filter(id => !setExistingIds.has(id));
            resolve({
                existingIds: [...setExistingIds],
                notExistingIds: [...notExistingIds]
            })
        }).catch(error => {
            console.error("🚀 ~ file: cod.local.queries.ts:125 ~ filterDuplicatedCODS ~ error:", error);
            reject(error);
        });;
    });
}