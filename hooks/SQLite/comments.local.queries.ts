import { db } from "./SQLite";

export function createCommentsTable() {
    db.execSync(
        `
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shipmentId INTEGER,
        comment TEXT
        );
        CREATE INDEX IF NOT EXISTS comments_shipmentID ON comments (shipmentID);
    `
    );
    const comments = db.getAllSync(`
        select * from comments;
    `);
}

export function insertComments(comments: { shipmentId: number, comment: string }[]) {
    return new Promise((resolve, reject) => {
        const shipmentIds = new Set(comments.map(v => v.shipmentId));


        db.getAllAsync(`
        SELECT * FROM comments WHERE shipmentId IN (${[...shipmentIds].join(',')}) AND comment IN (${comments.map(v => `'${v.comment}'`).join(',')});
        `).then((data) => {
            const existingComments = data as { shipmentId: number, comment: string }[];
            const notExistingComments = comments.filter(v => !existingComments.find(c => c.shipmentId === v.shipmentId && c.comment === v.comment));

            if (notExistingComments.length > 0) {
                db.runAsync(`
                    INSERT INTO comments (shipmentId, comment)
                    VALUES ${notExistingComments.map(v => `(${v.shipmentId}, '${v.comment}')`).join(',')};
                `,

                ).then((res) => {
                    resolve({
                        message: `Comments inserted correctly}`,
                        rowsInserted: res.changes
                    });
                }).catch(error => {
                    console.error(error);
                    reject(error);
                });
            } else {
                resolve("All comments has been inserted before.")
            }
        }).catch(error => {
            console.error(error);
            reject(error);
        });
    });
};