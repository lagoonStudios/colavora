import { db } from "../db";

/**
 * Creates a comments table in the provided SQLite database if it doesn't exist.
 * @returns A Promise that resolves with "Table created correctly" if successful, or rejects with an error.
 */
export function createCommentsTable() {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.execAsync(
            `
            drop table if exists comments;
          CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            createdDate TEXT DEFAULT datetime('now'),
            comment TEXT,
            is_sync BOOLEAN DEFAULT false,
            last_sync TEXT DEFAULT (datetime('now')),
            shipmentID INTEGER,
            FOREIGN KEY (shipmentID) REFERENCES shipments(shipmentID)
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
 * @param comments An array of objects containing comment data.
 * @returns A Promise that resolves with a message or rejects with an error.
 */
export function insertMultipleComments(comments: { shipmentID: number, comment: string, createdDate: string }[]) {
    return new Promise((resolve, reject) => {
        filterComments(comments).then((filteredComments) => {
            if (filteredComments.length > 0) {
                // TODO FIX DATE ISSUE, actualmente está usando la fecha actual, debería usar la del comment.
                const commentsToInsert = filteredComments.map(v => `(${v.shipmentID},'${v.comment}',datetime('now'))`)
                db.runAsync(`
                    INSERT INTO comments
                        (
                        shipmentId,
                        comment,
                        createdDate
                        )
                    VALUES ${commentsToInsert.join(',')};
                `,
                    commentsToInsert
                ).then((res) => {
                    resolve({
                        message: `Comments inserted correctly}`,
                        rowsInserted: res.changes
                    });
                }).catch(error => {
                    console.error("🚀 comments.local.queries.ts ~ inserMultipleComments ~ line 63 ~ error:", error);
                    reject(error);
                });
            } else {
                reject("All comments has been inserted before.")
            }
        }).catch(error => {
            console.error("🚀 comments.local.queries.ts ~ inserMultipleComments ~ line 74 ~ insertMultipleComments ~ error:", error);
            reject(error);
        });
    });
};

/**
 * Retrieves an array of comments associated with a specific shipment ID from the SQLite database.
 *
 * @param params - An object containing the shipment ID.
 * @returns A Promise that resolves to an array of comment strings,
 *                               or rejects with an error.
 */
export function getCommentsByShipmentID({ shipmentID }: { shipmentID: number }) {
    return new Promise((resolve: (value: string[]) => void, reject) => {
        db.getAllAsync(`
            SELECT 
                comment,
                createdDate
            FROM
                comments
            WHERE
                shipmentID = ?
            ORDER BY 
                createdDate DESC
            `, [shipmentID])
            .then((res) => {
                const data = res as string[];
                resolve(data);
            }).catch(error => {
                reject(error);
            });
    });
};

/**
 * Checks if the comments exist in the database and returns the ones that don't.
 * @param comments the comments to check.
 * @returns a promise that resolves with an array of comments that don't exist in the database.
 */
export function filterComments(comments: { shipmentID: number, comment: string, createdDate: string }[]) {
    return new Promise((resolve: (value: { shipmentID: number, comment: string, createdDate: string }[]) => void, reject) => {
        const shipmentIds = new Set(comments.map(v => v.shipmentID));
        db.getAllAsync(`
        SELECT 
            shipmentID, 
            comment,
            createdDate
        FROM 
            comments 
        WHERE 
            shipmentID 
        IN 
            (${[...shipmentIds].map(() => '?')}) 
        AND 
            comment
        IN 
            (${comments.map(() => '?')});
        `, [...shipmentIds, ...comments.map(v => `${v.comment}`)]).then((data) => {
            const existingComments = data as { shipmentID: number, comment: string, createdDate: string }[];
            const notExistingComments = comments.filter(v => {
                const exists = existingComments.find(c => c.shipmentID === v.shipmentID && c.comment === v.comment)
                if (exists != undefined)
                    return undefined
                else
                    return v;
            }).filter(v => v != undefined);
            if (notExistingComments.length > 0) { resolve(notExistingComments); }
            else {
                console.error("🚀 ~ comments.local.queries.ts ~ filterComments ~ line 123 ~ exception:", 'All comments has been inserted before.');
                reject('All comments has been inserted before.');
            }

        }).catch(error => {
            console.error("🚀 ~ comments.local.queries.ts ~ filterComments ~ line 125 ~ error:", error)
            reject(error);
        });

    });
}