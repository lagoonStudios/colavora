import { useCallback, useEffect, useState } from "react";
import { EventsQueueType, TAddCompleteOrderToQueue, TCompleteOrderProps, TCompleteOrderToApiProps, TUseHandleCompleteOrderEventProps } from "./eventsQueue.types";
import { useCompleteOrder, useSendCODs } from "@hooks/queries";
import { getEventsByType } from './eventsQueue.local.queries';
import { updateShipmentStatus } from "@hooks/SQLite";
import { ShipmentStatus } from "@constants/types/shipments";

export function useHandleCompleteOrderEvent({ removeFromQueue, removeIdFromHandleList, addEventToQueue }: TUseHandleCompleteOrderEventProps) {

    // --- Hooks -----------------------------------------------------------------
    const [error, setError] = useState<unknown | null>(null);
    const { mutate: completeOrderMutation } = useCompleteOrder();
    const { mutate: sendCODMutation, status: sendCODStatus, error: sendCODError } = useSendCODs();
    // --- END: Hooks ------------------------------------------------------------
    // --- Data and handlers -----------------------------------------------------
    const completeOrderToApi = useCallback(({ order, options: { eventId } }: TCompleteOrderToApiProps) => {
        const cods = order.completeCODs;
        if (cods.length > 0) {
            sendCODMutation({ CODs: cods, eventId, removeIdFromHandleList, removeFromQueue, callback: handleUploadCompleteOrder });
        } else {
            handleUploadCompleteOrder();
        }
    }, [])

    const removeFromLocalDB = useCallback(({ shipmentID, eventId }: { shipmentID: number, eventId: number }) => {
        updateShipmentStatus({ shipmentId: shipmentID, status: ShipmentStatus.COMPLETED, isSync: false })
        removeFromQueue(eventId);
    }, [])

    const addCompleteOrderEvent = useCallback(
        ({ order }: TAddCompleteOrderToQueue) => {
            return new Promise((resolve, reject) => {
                const body = JSON.stringify(order);
                addEventToQueue({
                    body,
                    eventType: EventsQueueType.ORDER_COMPLETED,
                    shipmentID: order.shipmentID,
                })
                    .then((res) => {
                        updateShipmentStatus({ shipmentId: order.shipmentID, status: ShipmentStatus.COMPLETED, isSync: false })
                        resolve({
                            message: "Order added to queue",
                            code: 200,
                        });
                    })
                    .catch((error) => {
                        console.error(
                            "🚀 ~ file: eventsQueue.tsx:144 ~ returnnewPromise ~ error:",
                            error
                        );
                        reject(error);
                    });
            });
        },
        []
    );

    const handleUploadCompleteOrder = useCallback(() => {
        getEventsByType(EventsQueueType.ORDER_COMPLETED).then((data) => {

            data.forEach((dt) => {
                const order: TCompleteOrderProps = JSON.parse(dt.body);
                completeOrderMutation({
                    order: {
                        shipmentID: order.shipmentID,
                        podName: order.podName,
                        comment: order.comment,
                        companyID: order.companyID,
                        signatureImage: order.signatureImage,
                        userID: order.userID,
                        photoImage: order.photoImage,
                        barcodes: order.barcodes,
                    },
                    options: {
                        eventId: dt.id,
                        removeFromQueue: removeFromLocalDB,
                        removeIdFromHandleList
                    }
                })
            })
        }).catch(error => { });

    }, [])
    // --- END: Data and handlers ------------------------------------------------
    // --- Side effects ----------------------------------------------------------
    useEffect(() => {
        if (sendCODStatus === "error") {
            console.error("🚀 ~ file: eventsQueue.tsx:108 ~ sendCODS ~ error:", sendCODError);
            setError(sendCODError);
        }
    }, [sendCODError, sendCODStatus])
    // --- END: Side effects -----------------------------------------------------

    return {
        completeOrderToApi,
        addCompleteOrderEvent
    }
}