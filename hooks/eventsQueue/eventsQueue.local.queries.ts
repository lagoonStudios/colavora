import { db } from "@hooks/SQLite";
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
        const events = db.getAllSync(`SELECT id, eventType, shipmentID FROM eventsQueue`);
        console.log({ events });
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