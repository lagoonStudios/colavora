import { db } from "./SQLite";
/**
 * Creates the `manifests` table in the SQLite database if it doesn't exist.

 * @param  db The SQLite database connection.
 */
export function createManifestsTable() {
    db.execSync(
        `
      CREATE TABLE IF NOT EXISTS manifests (manifestID VARCHAR(20) PRIMARY KEY UNIQUE);
    `
    )
}

/**
 * Inserts a single manifest into the SQLite database if it doesn't already exist.

 * @param db The SQLite database connection.
 * @param manifestID The manifest ID to insert.
 * @returns A promise that resolves with "Manifest inserted correctly" if successful, or rejects with an error message.
 */
export function insertManifest(manifestID: string) {
    return new Promise((resolve, reject) => {
        db.getFirstAsync("SELECT manifestID FROM manifests WHERE manifestID = '${?}'", manifestID).then((exists) => {
            if (exists != null) {
                reject("Manifest already exists");
                return
            };

            db.runAsync(
                `INSERT INTO manifests (manifestID) VALUES ('?');`, manifestID
            ).then(() => {
                resolve("Manifest inserted correctly");
            })
                .catch((error) => {
                    reject("Manifest not inserted correctly");
                });
        });
    })
}

/**
 * Inserts multiple manifests into a SQLite database.
 *
 * @param  db The SQLite database connection.
 * @param manifestIDs An array of manifest IDs to insert (strings).
 * @returns  A promise that resolves with an object containing a success message and the IDs of the inserted manifests. Rejects with an error message if any errors occur.
 *
 * @throws {Error}  - Rejects with an error if there is a problem with the database operation.
 */
export function insertMultipleManifests(manifestIDs: string[]) {
    return new Promise((resolve, reject) => {
        const incomingIds = manifestIDs.map(v => String(v));
        db.getAllAsync(`SELECT * FROM manifests WHERE manifestID IN (${incomingIds})`).then((returnedData) => {
            const setExistingIds = new Set<string>();
            (returnedData as { manifestID: string }[]).forEach(item => {
                setExistingIds.add(item.manifestID);
            });
            const setIncomingIds = new Set(manifestIDs);
            const notExistingIds = [...setIncomingIds].filter(id => !setExistingIds.has(id));

            if (notExistingIds.length > 0) {
                const ids = notExistingIds.map(v => `('${v}')`).join(',');
                db.runAsync(`
                INSERT INTO manifests (manifestID) VALUES ${ids};
                `,
                    notExistingIds
                ).then((res) => {
                    console.log("rows inserted correctly", res.changes);
                    resolve({
                        message: `Ids inserted correctly}`,
                        idsInserted: res.changes
                    });
                }).catch(error => {
                    reject(error);
                });
            } else {
                reject("All ids has been inserted before.")
            }
        }).catch(error => {
            reject(error);
        });
    })
};