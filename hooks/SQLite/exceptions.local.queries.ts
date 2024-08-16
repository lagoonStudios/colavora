import { IReasonsByIdData } from "@constants/types/general";
import { SQLiteDatabase } from "expo-sqlite";

export function createExceptionsTable(db: SQLiteDatabase) {
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
            completeOrder BOOLEAN
        );
        `
        ).then(() => {
            resolve("exceptions Table created correctly");
        }).catch(error => {
            reject("ERROR Creating exceptions table: " + error);
        });

        const res = db.getAllSync(`SELECT reasonID FROM exceptions`);
    });
}

export function insertMultipleExceptions(db: SQLiteDatabase, exceptions: IReasonsByIdData[]) {
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

export function getAllExceptions(db: SQLiteDatabase) {
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