import { useCallback } from "react";
import { EventsQueueType, TAddCompleteOrderToQueue, TCompleteOrderProps, TCompleteOrderToApiProps, TOrderExceptionsProps, TSendCODSProps, TUseEventsProps } from "./eventsQueue.types";
import { useAddComment, useCompleteOrder, useOrderException, useSendCODs } from "@hooks/queries";
import { getEventsByID } from './eventsQueue.local.queries';
import { updateShipmentByException, updateShipmentStatus } from "@hooks/SQLite";
import { CompleteOrderMutationProps, ShipmentStatus } from "@constants/types/shipments";
import { useStore } from "@stores/zustand";
import { insertMultipleComments } from "@hooks/SQLite/queries/comments.local.queries";

export function useHandleCompleteOrderEvent({ removeFromQueue, removeIdFromHandleList, addEventToQueue }: TUseEventsProps) {

    // --- Hooks -----------------------------------------------------------------
    const { mutate: completeOrderMutation } = useCompleteOrder();
    const { mutate: sendCODMutation } = useSendCODs();
    // --- END: Hooks ------------------------------------------------------------
    // --- Data and handlers -----------------------------------------------------
    const handleCODSErrorCallback = useCallback((props: TSendCODSProps) => {
        const { options: { eventId } } = props
        if (eventId != null) removeIdFromHandleList(eventId)
        else {
            console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCODSErrorCallback ~ eventId:", eventId);
            throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCODSErrorCallback ~ eventId not found")
        }
    }, [])
    const handleCODSSuccessCallback = useCallback((props: TSendCODSProps) => {
        const { options: { eventId } } = props
        if (eventId != null) handleUploadCompleteOrder(eventId)
        else {
            console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCODSSuccessCallback ~ eventId:", eventId);
            throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCODSSuccessCallback ~ eventId not found")
        }
    }, [])

    const handleCompleteOrderSuccessCallback = useCallback((props: CompleteOrderMutationProps) => {
        const { order: { shipmentID }, options: { eventId } } = props

        if (eventId != null && shipmentID != null) {
            updateShipmentStatus({ shipmentId: shipmentID, status: ShipmentStatus.COMPLETED, isSync: true })
            removeIdFromHandleList(eventId)
            removeFromQueue(eventId);
        }
        else {
            console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCompleteOrderSuccessCallback ~ eventId or shipmentID not found", { eventId, shipmentID });
            throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCompleteOrderSuccessCallback ~ eventId or shipmentID not found")
        }
    }, [])
    const handleCompleteOrderErrorCallback = useCallback((props: CompleteOrderMutationProps) => {
        const { options: { eventId } } = props
        if (eventId != null) {
            removeIdFromHandleList(eventId)
        } else {
            console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCompleteOrderErrorCallback ~ eventId:", eventId);
            throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCompleteOrderErrorCallback ~ eventId not found")
        }
    }, [])

    const completeOrderToApi = useCallback(({ order, options: { eventId } }: TCompleteOrderToApiProps) => {
        const cods = order.completeCODs;
        if (cods.length > 0) {
            sendCODMutation({ CODS: cods, options: { eventId, onError: handleCODSErrorCallback, onSuccess: handleCODSSuccessCallback } });
        } else {
            handleUploadCompleteOrder(eventId);
        }
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

    const handleUploadCompleteOrder = useCallback((eventId: number) => {
        getEventsByID(eventId).then((res) => {
            console.log("EVENT DATA: ", res);
            // res.forEach((dt) => {
            const order: TCompleteOrderProps = JSON.parse(res.body);
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
                    eventId: res.id,
                    onError: handleCompleteOrderErrorCallback,
                    onSuccess: handleCompleteOrderSuccessCallback
                }
            })
            // })
        }).catch(error => {
            console.error("🚀 ~ file: eventsQueue.functions.ts:118 ~ handleUploadCompleteOrder ~ getEventsByID ~ error:", error);
        });

    }, [])
    // --- END: Data and handlers ------------------------------------------------

    return {
        completeOrderToApi,
        addCompleteOrderEvent
    }
}


export function useHandleOrderExceptionEvent({ removeFromQueue, removeIdFromHandleList, addEventToQueue }: TUseEventsProps) {
    // --- Hooks -----------------------------------------------------------------
    const { mutate: addCommentMutation } = useAddComment();
    const { mutate: orderExceptionMutation } = useOrderException();
    const { user } = useStore();
    // --- END: Hooks ------------------------------------------------------------

    // --- Data and handlers -----------------------------------------------------
    const onOrderExceptionErrorCallback = useCallback((props: TOrderExceptionsProps) => {
        if (props.options.eventId != null) removeIdFromHandleList(props.options.eventId)
        else {
            console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionErrorCallback ~ eventId:", props.options.eventId);
            throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionErrorCallback ~ eventId not found")
        }
    }, [removeIdFromHandleList])


    const onSendCommentErrorCallback = useCallback((props: TOrderExceptionsProps) => {
        if (props.options.eventId != null) removeIdFromHandleList(props.options.eventId)
        else {
            console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ onSendCommentErrorCallback ~ eventId:", props.options.eventId);
            throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ onSendCommentErrorCallback ~ eventId not found")
        }
    }, [removeIdFromHandleList]);

    const onSendCommentSuccessCallback = useCallback((props: TOrderExceptionsProps) => {
        if (props.options.eventId != null) {
            removeIdFromHandleList(props.options.eventId)
            removeFromQueue(props.options.eventId)
        }
        else {
            console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ onSendCommentSuccessCallback ~ eventId:", props.options.eventId);
            throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ onSendCommentSuccessCallback ~ eventId not found")
        }
    }, [removeIdFromHandleList, removeFromQueue]);



    /**
     * Stores an orderException event in the queue.
     * @see {@link TOrderExceptionsProps}
     */
    const addExceptionEvent = useCallback((data: TOrderExceptionsProps) => {
        return new Promise((resolve, reject) => {
            console.log("Adding exception event to queue: ", data.shipmentID);
            if (user == null) {
                console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ addExceptionEvent ~ user not defined:", user);
                throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ addExceptionEvent ~ user not defined:")
            }
            const body = JSON.stringify({
                comment: data.comment,
                companyID: user.companyID,
                shipmentID: data.shipmentID,
                reasonID: data.reasonID,
                photoImage: data.photoImage,
                userID: user.userID,
            });
            const commentToInsert = [
                {
                    shipmentID: data.shipmentID,
                    comment: data.comment,
                    createdDate: new Date().toISOString(),
                },
            ];
            //In the local db: Updates the is_sync state, inserts the comments and add the events to the queue.
            Promise.all([
                updateShipmentByException({
                    isSync: false,
                    shipmentID: data.shipmentID,
                    reasonCode: data.reasonID,
                }),
                insertMultipleComments(commentToInsert),
                addEventToQueue({
                    body,
                    shipmentID: data.shipmentID,
                    eventType: EventsQueueType.ORDER_EXCEPTION,
                }),

            ]).then(() => {
                resolve({
                    message: "Order exception stored locally",
                    code: 200,
                });
            })
                .catch((error) => {
                    console.error(
                        "🚀 ~ file: eventsQueue.tsx:92 ~ orderException ~ error:",
                        error
                    );
                    reject(error);
                });
        });
    }, [updateShipmentByException, insertMultipleComments, addEventToQueue, user])

    const sendCommentToApi = (data: TOrderExceptionsProps) => {
        console.log("sending comment to API: ", data.shipmentID);
        if (user == null) {
            console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ sendCommentToApi ~ user not defined:", user);
            throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ sendCommentToApi ~ user not defined:")
        }
        addCommentMutation({
            comment: data.comment,
            companyID: user.companyID,
            shipmentID: data.shipmentID,
            userID: user.userID,
            options: {
                eventId: data.options.eventId,
                onError: onSendCommentErrorCallback,
                onSuccess: onSendCommentSuccessCallback
            }
        })
    }

    const onOrderExceptionSuccessCallback = useCallback((props: TOrderExceptionsProps) => {
        console.log("Order exception success callback: ", props.comment);
        if (props.options.eventId != null) sendCommentToApi(props)
        else {
            console.error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionSuccessCallback ~ eventId:", props.options.eventId);
            throw new Error("🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionSuccessCallback ~ eventId not found")
        }
    }, [sendCommentToApi])


    /**
     * Sends an orderException event to the API.
     * Then calls a callback if succeeded to send the comment to the API.
     * @see {@link TOrderExceptionsProps}
     */
    const sendExceptionToApi = useCallback((data: TOrderExceptionsProps) => {
        console.log("Sending exception event to API: ", data.shipmentID);
        orderExceptionMutation({
            comment: data.comment,
            shipmentID: data.shipmentID,
            reasonID: data.reasonID,
            photoImage: data.photoImage,
            options: {
                eventId: data.options.eventId,
                onError: onOrderExceptionErrorCallback,
                onSuccess: onOrderExceptionSuccessCallback
            }
        })
        console.log("After mutation log");
    }, [onOrderExceptionErrorCallback, onOrderExceptionSuccessCallback, orderExceptionMutation])
    // --- END: Data and handlers ------------------------------------------------

    return {
        addExceptionEvent,
        sendExceptionToApi
    }
}