import { createCODTable, dropCODTable } from "./cod.local.queries";
import { createCommentsTable, dropCommentsTable } from "./comments.local.queries";
import { createExceptionsTable, dropExceptionsTable } from "./exceptions.local.queries";
import { createManifestsTable, dropManifestTable, getAllManifestsCount } from "./manifests.local.queries";
import { createPiecesTable, dropPiecesTable } from "./pieces.local.queries";
import { createShipmentTable, dropShipmentTable, getTodaysShipments } from "./shipments.local.queries";



export function createAllDBTables() {
    return new Promise((resolve, reject) => {
        Promise.all([
            createManifestsTable(),
            createShipmentTable(),
            createCommentsTable(),
            createPiecesTable(),
            createExceptionsTable(),
            createCODTable(),
        ])
            .then((res) => {
                resolve("Tables created correctly");
            })
            .catch((error) => {
                console.error("🚀 ~ file: general.local.queries.ts:24 ~ createAllDBTables ~ error:", error);
                reject(error);
            });
    });
}


export function resetDatabase() {
    return new Promise((resolve: (value: string) => void, reject) => {
        console.info("🚀 ~ file: general.local.queries.ts:33 ~ resetDatabase 'NEED TO COMPLETE THIS FUNCTION'");
        // TODO Obtener toda la data, guardarla en un array y luego borrar las tablas, esperar a que se vuelvan a crear y luego insertar los datos
        // TODO Para evitar que se pierda información al sincronizar.
        Promise.all([
            dropManifestTable(),
            dropShipmentTable(),
            dropPiecesTable(),
            dropCommentsTable(),
            dropExceptionsTable(),
            dropCODTable()
        ]).then((res) => {
            createAllDBTables().then((res) => {
                resolve("Database started correctly");
            }).catch((error) => {
                console.error("🚀 ~ file: general.local.queries.ts:44 ~ resetDatabase ~ createAllDBTables ~ error:", error);
                reject(error);
            });

        }).catch(error => {
            console.error("🚀 ~ file: general.local.queries.ts:16 ~ resetDatabase ~ error:", error);
            reject(error);
        });
    });
}

export function getHomeCounters() {
    return new Promise((resolve: (value: { todayShipments: number, manifests: number }) => void, reject) => {
        Promise.all([
            getTodaysShipments(),
            getAllManifestsCount()
        ]).then((res) => {
            const todayShipments = res[0].count;
            const manifests = res[1].count;
            resolve({ todayShipments, manifests });
        }).catch(error => {
            error("🚀 ~ file: general.local.queries.ts:16 ~ getHomeCounters ~ error:", error);
            reject(error);
        });
    });
}
