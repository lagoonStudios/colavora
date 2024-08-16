import { SQLiteDatabase } from "expo-sqlite";

/**
 * Creates a comments table in the provided SQLite database if it doesn't exist.
 * @param db The SQLite database instance.
 * @returns A Promise that resolves with "Table created correctly" if successful, or rejects with an error.
 */
export function createCommentsTable(db: SQLiteDatabase) {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.execAsync(
            `
          CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            comment TEXT,
            shipmentID INTEGER
            );

            CREATE INDEX IF NOT EXISTS comments_shipmentID_idx ON comments (shipmentID);
        `
        ).then(() => {
            resolve("Table created correctly");
        }).catch(error => {
            reject("ERROR Creating comments table: " + error);
        });
    });

}

/**
 * Inserts comments into the comments table of the provided SQLite database.
 *
 * The function first checks for existing comments with the same shipment ID and comment.
 * It then inserts only the new comments that are not already present in the table.
 *
 * @param db The SQLite database instance.
 * @param comments An array of objects containing comment data.
 * @returns A Promise that resolves with a message or rejects with an error.
 */
export function insertMultipleComments(db: SQLiteDatabase, comments: { shipmentID: number, comment: string }[]) {
    return new Promise((resolve, reject) => {
        const shipmentIds = new Set(comments.map(v => v.shipmentID));
        db.getAllAsync(`
        SELECT shipmentID, comment FROM comments WHERE shipmentID IN (${[...shipmentIds]}) AND comment IN (${comments.map(v => `'${v.comment}'`)});
        `).then((data) => {
            const existingComments = data as { shipmentID: number, comment: string }[];
            const notExistingComments = comments.filter(v => {
                const exists = existingComments.find(c => c.shipmentID === v.shipmentID && c.comment === v.comment)
                if (exists != undefined)
                    return undefined
                else
                    return v;
            }).filter(v => v != undefined);

            if (notExistingComments.length > 0) {

                db.runAsync(`
                    INSERT INTO comments (shipmentId, comment)
                    VALUES ${notExistingComments.map(v => `(${v.shipmentID}, '${v.comment}')`).join(',')};
                `,

                ).then((res) => {
                    resolve({
                        message: `Comments inserted correctly}`,
                        rowsInserted: res.changes
                    });
                }).catch(error => {
                    console.error("🚀 ~ insertMultipleComments ~ error:", error);
                    reject(error);
                });
            } else {
                reject("All comments has been inserted before.")
            }
        }).catch(error => {
            console.error("🚀 ~ insertMultipleComments ~ error:", error);
            reject(error);
        });
    });
};


export function getCommentsByShipmentID(db: SQLiteDatabase, { shipmentID }: { shipmentID: number }) {
    return new Promise((resolve: (value: string[]) => void, reject) => {
        db.getAllAsync(`
            SELECT 
                comment
            FROM
                comments
            WHERE
                shipmentID = ?
            `, [shipmentID])
            .then((res) => {
                const data = res as string[];
                resolve(data);
            }).catch(error => {
                reject(error);
            });
    });
};