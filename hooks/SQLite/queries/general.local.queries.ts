import { getAllManifestsCount } from "./manifests.local.queries";
import { getTodaysShipments } from "./shipments.local.queries";


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