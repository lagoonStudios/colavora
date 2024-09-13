import { db } from "@hooks/SQLite/db";
import { EventsQueueType, TEventQueueData, TInsertEventParams } from "./eventsQueue.types";

/**
 * Creates the eventsQueue table in the local SQLite database if it doesn't exist.
 */
export function createEventsQueueTable() {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.runAsync(`
            CREATE TABLE IF NOT EXISTS eventsQueue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                eventType CHECK (eventType IN ('${EventsQueueType.ORDER_EXCEPTION}', '${EventsQueueType.ORDER_COMPLETED}')) NOT NULL,
                body TEXT NOT NULL,
                tries INTEGER NOT NULL DEFAULT 0,
                shipmentID INTEGER NOT NULL,
                FOREIGN KEY (shipmentID) REFERENCES shipments(shipmentID)
            )
            `).then(
                () => {
                    resolve('Events table created successfully')
                }
        ).catch(error => {
            console.error("🚀 ~ file: eventsQueue.loca.queries.ts:8 ~ returnnewPromise ~ error:", error);
            reject(error)
        })

    });
}

// export function dropEventsQueueTable() {
//     return new Promise((resolve: ({ status, message }: { status: number, message: string }) => void, reject) => {
//         db.execAsync(`DROP TABLE IF EXISTS eventsQueue;`)
//             .then(() => {
//                 resolve({
//                     status: 200,
//                     message: "Table dropped correctly"
//                 });
//             }).catch(error => {
//                 console.error("🚀 ~ file: eventsQueue.local.queries.ts:44 ~ dropEventsQueueTable ~ error:", error);
//                 reject(error)
//             });
//     });
// };

/**
 * Inserts the event into the eventsQueue table.
 * @param params event to insert.
 * @see {@link InsertEventParams}
 */
export function insertEvent({ eventType, body, shipmentID }: TInsertEventParams) {
    return new Promise((resolve: ({ id, message }: { id: number, message: string }) => void, reject) => {
        db.runAsync(`
            INSERT INTO eventsQueue (
                eventType,
                body,
                shipmentID
            ) VALUES (
                ?,
                ?,
                ?
            )
        `,
            [eventType, body, shipmentID]).then((res) => {
                resolve({
                    id: res.lastInsertRowId,
                    message: 'Event inserted successfully'
                })
            }).catch(error => {
                console.error("🚀 ~ file: eventsQueue.local.queries.ts:57 ~ insertEventQueue ~ error:", error);
                reject(error)
            })
    });
}

/**
 * Removes the event from the eventsQueue table.
 * @param id the id of the event to remove.
 */
export function removeEvent(id: number) {
    return new Promise((resolve: ({ message }: { message: string }) => void, reject) => {
        db.runAsync(`DELETE FROM eventsQueue WHERE id = ${id}`)
            .then(() => {
                resolve({
                    message: 'Event deleted successfully'
                })
            }).catch(error => {
                console.error("🚀 ~ file: eventsQueue.local.queries.ts:71 ~ removeEventQueue ~ error:", error);
                reject(error)
            })
    });
}

export function getEventsQueue() {
    return new Promise((resolve: (value: TEventQueueData[]) => void, reject) => {
        db.getAllAsync(`
        SELECT 
            id,
            eventType,
            body,
            shipmentID
        FROM 
            eventsQueue
        ORDER BY 
            id ASC
    `).then((res) => {
        const data = res as TEventQueueData[];
            resolve(data);
        }).catch(error => {
            console.error("🚀 ~ file: eventsQueue.local.queries.ts:100 ~ getEventsQueue ~ error:", error);
            reject(error);
        });
    });

};

export function getEventsQueuedIds() {
    return new Promise((resolve: (value: number[]) => void, reject) => {
        db.getAllAsync(`
            SELECT id from eventsQueue
            `).then((res) => {
            const data = res as { id: number }[];
            resolve(data.map(({ id }) => id));
        }).catch(error => {
            console.error("🚀 ~ file: eventsQueue.local.queries.ts:100 ~ getEventsQueue ~ error:", error);
            reject(error);
        });
    })
}

export function getEventsByID(id: number) {
    return new Promise((resolve: (value: TEventQueueData) => void, reject) => {
        try {
            const res = db.getFirstSync(`SELECT id, eventType, body, shipmentID FROM eventsQueue WHERE id = '${id}'`);
            const data: TEventQueueData = res as any;
            resolve(data);
        } catch (error) {
            console.error("🚀 ~ file: eventsQueue.local.queries.ts:140 ~ getEventsByType ~ error:", error);
            reject(error);
        }

    });
}


export function updateShipmentByException({ isSync, shipmentID, reasonCode }: { isSync: boolean, shipmentID: number, reasonCode: string }) {
    return new Promise((resolve, reject) => {
        db.runAsync(`
            UPDATE shipments
                SET is_sync = $isSync, reason = $reasonCode
            WHERE
                shipmentID = $shipmentId
            `, { $isSync: isSync, $shipmentID: shipmentID, $reasonCode: reasonCode })
            .then(() => {
                resolve({
                    message: "is_sync state updated",
                    changes: { is_sync: isSync }
                })
            })
            .catch(error => {
                console.error("🚀 ~ file: shipments.local.queries.ts:358 ~ updateShipmentIsSyncState ~ error:", error);
                reject(error)
            });
    });
}

/**
 * Updates the status of a shipment in the database.
 * @param  options.shipmentId - The unique identifier of the shipment to update.
 * @param  options.status - The new status for the shipment.
 * @returns A Promise that resolves with a success message if the update is successful, or rejects with an error message if the update fails.
 */
export function updateShipmentStatus({ shipmentId, status, isSync }: { shipmentId: number, status: ShipmentStatus, isSync: boolean }) {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.runAsync(`
            UPDATE shipments
            SET status = $status,
            is_sync = $isSync
            WHERE shipmentID = $shipmentId
        `, { $status: status, $shipmentId: shipmentId, $isSync: isSync })
            .then((res) => {
                if (res.changes === 0) {
                    console.error("🚀 ~ updateShipmentStatus ~ shipmentId not found",);
                    reject("shipmentId not found");
                    return;
                }

                resolve("Status updated correctly");
            }).catch(error => {
                console.error("🚀 ~ updateShipmentStatus ~ error:", error);
                reject(error);
            });

    });
}



export function deleteShipment({ shipmentID }: { shipmentID: number }) {
    return new Promise((resolve: (value: string) => void, reject) => {
        db.runAsync(`
            DELETE FROM shipments
            WHERE shipmentID = $shipmentId
        `, { $shipmentId: shipmentID })
            .then(() => {
                resolve("Shipment deleted successfully");
            }).catch(error => {
                console.error("🚀 ~ deleteShipment ~ error:", error);
                reject(error);
            });
    })
};