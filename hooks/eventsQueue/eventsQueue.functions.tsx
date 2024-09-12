import { useCallback } from "react";
import {
  EventsQueueType,
  TAddCompleteOrderToQueue,
  TCompleteOrderProps,
  TCompleteOrderToApiProps,
  TOrderExceptionsProps,
  TSendCODSProps,
  TUseEventsProps,
} from "./eventsQueue.types";
import {
  useAddComment,
  useCompleteOrder,
  useOrderException,
  useSendCODs,
} from "@hooks/queries";
import { getEventsByID } from "./eventsQueue.local.queries";
import { updateShipmentByException, updateShipmentStatus } from "@hooks/SQLite";
import {
  CompleteOrderMutationProps,
  ShipmentStatus,
} from "@constants/types/shipments";
import { useStore } from "@stores/zustand";
import { insertMultipleComments } from "@hooks/SQLite/queries/comments.local.queries";

export function useHandleCompleteOrderEvent({
  removeFromQueue,
  removeIdFromHandleList,
  addEventToQueue,
}: TUseEventsProps) {
  // --- Hooks -----------------------------------------------------------------
  const { mutate: completeOrderMutation } = useCompleteOrder();
  const { mutate: sendCODMutation } = useSendCODs();
  // --- END: Hooks ------------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------
  const handleCODSErrorCallback = useCallback(
    (props: TSendCODSProps) => {
      const {
        options: { eventId },
      } = props;
      if (eventId != null) removeIdFromHandleList(eventId);
      else {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCODSErrorCallback ~ eventId:",
          eventId
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCODSErrorCallback ~ eventId not found"
        );
      }
    },
    [removeIdFromHandleList]
  );

  const handleCompleteOrderSuccessCallback = useCallback(
    (props: CompleteOrderMutationProps) => {
      const {
        order: { shipmentID },
        options: { eventId },
      } = props;

      if (eventId != null && shipmentID != null) {
        console.log("Shipment to update: ", shipmentID);
        updateShipmentStatus({
          shipmentId: shipmentID,
          status: ShipmentStatus.COMPLETED,
          isSync: true,
        })
          .then(() => {
            removeIdFromHandleList(eventId);
            removeFromQueue(eventId);
          })
          .catch((error) => {
            removeIdFromHandleList(eventId);
            console.error(
              "🚀 ~ file: eventsQueue.functions.tsx:84 ~ error:",
              error
            );
          });
      } else {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCompleteOrderSuccessCallback ~ eventId or shipmentID not found",
          { eventId, shipmentID }
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCompleteOrderSuccessCallback ~ eventId or shipmentID not found"
        );
      }
    },
    [removeFromQueue, removeIdFromHandleList]
  );
  const handleCompleteOrderErrorCallback = useCallback(
    (props: CompleteOrderMutationProps) => {
      const {
        options: { eventId },
      } = props;
      if (eventId != null) {
        removeIdFromHandleList(eventId);
      } else {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCompleteOrderErrorCallback ~ eventId:",
          eventId
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCompleteOrderErrorCallback ~ eventId not found"
        );
      }
    },
    [removeIdFromHandleList]
  );
  const addCompleteOrderEvent = useCallback(
    ({ order }: TAddCompleteOrderToQueue) => {
      return new Promise((resolve, reject) => {
        const body = JSON.stringify(order);
        addEventToQueue({
          body,
          eventType: EventsQueueType.ORDER_COMPLETED,
          shipmentID: order.shipmentID,
        })
          .then(async () => {
            try {
              await updateShipmentStatus({
                shipmentId: order.shipmentID,
                status: ShipmentStatus.COMPLETED,
                isSync: false,
              });
              resolve({
                message: "Order added to queue",
                code: 200,
              });
            } catch (error) {
              console.error(
                "🚀 ~ file: eventsQueue.functions.tsx:145 ~ .then ~ error:",
                error
              );
              reject(error);
            }
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
    [addEventToQueue]
  );

  const handleUploadCompleteOrder = useCallback(
    (eventId: number) => {
      getEventsByID(eventId)
        .then((res) => {
          const order: Omit<TCompleteOrderProps, "options"> = JSON.parse(
            res.body
          );
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
              onSuccess: handleCompleteOrderSuccessCallback,
            },
          });
        })
        .catch((error) => {
          console.error(
            "🚀 ~ file: eventsQueue.functions.ts:118 ~ handleUploadCompleteOrder ~ getEventsByID ~ error:",
            error
          );
        });
    },
    [
      completeOrderMutation,
      handleCompleteOrderErrorCallback,
      handleCompleteOrderSuccessCallback,
    ]
  );

  const handleCODSSuccessCallback = useCallback(
    (props: TSendCODSProps) => {
      console.log("sending CODS to api: ", props.CODS);
      const {
        options: { eventId },
      } = props;
      if (eventId != null) handleUploadCompleteOrder(eventId);
      else {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCODSSuccessCallback ~ eventId:",
          eventId
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleCODSSuccessCallback ~ eventId not found"
        );
      }
    },
    [handleUploadCompleteOrder]
  );

  const completeOrderToApi = useCallback(
    ({ order, options: { eventId } }: TCompleteOrderToApiProps) => {
      console.log("sending complete order to api: ", order.shipmentID);
      const cods = order.completeCODs;
      if (cods.length > 0) {
        sendCODMutation({
          CODS: cods,
          options: {
            eventId,
            onError: handleCODSErrorCallback,
            onSuccess: handleCODSSuccessCallback,
          },
        });
      } else {
        handleUploadCompleteOrder(eventId);
      }
    },
    [
      handleCODSErrorCallback,
      handleCODSSuccessCallback,
      handleUploadCompleteOrder,
      sendCODMutation,
    ]
  );
  // --- END: Data and handlers ------------------------------------------------

  return {
    completeOrderToApi,
    addCompleteOrderEvent,
  };
}

export function useHandleOrderExceptionEvent({
  removeFromQueue,
  removeIdFromHandleList,
  addEventToQueue,
}: TUseEventsProps) {
  // --- Hooks -----------------------------------------------------------------
  const { mutate: addCommentMutation } = useAddComment();
  const { mutate: orderExceptionMutation } = useOrderException();
  const { user, reasons } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onOrderExceptionErrorCallback = useCallback(
    (props: TOrderExceptionsProps) => {
      if (props.options.eventId != null)
        removeIdFromHandleList(props.options.eventId);
      else {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionErrorCallback ~ eventId:",
          props.options.eventId
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionErrorCallback ~ eventId not found"
        );
      }
    },
    [removeIdFromHandleList]
  );

  const onSendCommentErrorCallback = useCallback(
    (props: TOrderExceptionsProps) => {
      if (props.options.eventId != null)
        removeIdFromHandleList(props.options.eventId);
      else {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ onSendCommentErrorCallback ~ eventId:",
          props.options.eventId
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ onSendCommentErrorCallback ~ eventId not found"
        );
      }
    },
    [removeIdFromHandleList]
  );

  const onSendCommentSuccessCallback = useCallback(
    (props: TOrderExceptionsProps) => {
      if (props.options.eventId != null) {
        removeIdFromHandleList(props.options.eventId);
        removeFromQueue(props.options.eventId);
      } else {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ onSendCommentSuccessCallback ~ eventId:",
          props.options.eventId
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ onSendCommentSuccessCallback ~ eventId not found"
        );
      }
    },
    [removeIdFromHandleList, removeFromQueue]
  );

  /**
   * Stores an orderException event in the queue.
   * @see {@link TOrderExceptionsProps}
   */
  const addExceptionEvent = useCallback(
    (data: Omit<TOrderExceptionsProps, "options">) => {
      return new Promise((resolve, reject) => {
        if (user == null) {
          console.error(
            "🚀 ~ file: eventsQueue.functions.ts:47 ~ addExceptionEvent ~ user not defined:",
            user
          );
          throw new Error(
            "🚀 ~ file: eventsQueue.functions.ts:47 ~ addExceptionEvent ~ user not defined:"
          );
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
        ])
          .then(() => {
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
    },
    [addEventToQueue, user]
  );

  const sendCommentToApi = useCallback(
    (data: TOrderExceptionsProps) => {
      if (user == null) {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ sendCommentToApi ~ user not defined:",
          user
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ sendCommentToApi ~ user not defined:"
        );
      }

      const selectedReasonLabel =
        reasons?.find(({ reasonID }) => reasonID === Number(data.reasonID))
          ?.reasonCodeDesc || "";
      console.log("sending message to api: ", data.comment);
      addCommentMutation({
        comment: `Order Exception - ${selectedReasonLabel} - ${data.comment}`,
        companyID: user.companyID,
        shipmentID: data.shipmentID,
        userID: user.userID,
        options: {
          eventId: data.options.eventId,
          onError: onSendCommentErrorCallback,
          onSuccess: onSendCommentSuccessCallback,
        },
      });
    },
    [
      addCommentMutation,
      onSendCommentErrorCallback,
      onSendCommentSuccessCallback,
      reasons,
      user,
    ]
  );

  const onOrderExceptionSuccessCallback = useCallback(
    (props: TOrderExceptionsProps) => {
      if (props.options.eventId != null) sendCommentToApi(props);
      else {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionSuccessCallback ~ eventId:",
          props.options.eventId
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionSuccessCallback ~ eventId not found"
        );
      }
    },
    [sendCommentToApi]
  );

  /**
   * Sends an orderException event to the API.
   * Then calls a callback if succeeded to send the comment to the API.
   * @see {@link TOrderExceptionsProps}
   */
  const sendExceptionToApi = useCallback(
    (data: TOrderExceptionsProps) => {
      console.log("sending exception to api: ", data.shipmentID);
      orderExceptionMutation({
        comment: data.comment,
        shipmentID: data.shipmentID,
        reasonID: data.reasonID,
        photoImage: data.photoImage,
        options: {
          eventId: data.options.eventId,
          onError: onOrderExceptionErrorCallback,
          onSuccess: onOrderExceptionSuccessCallback,
        },
      });
    },
    [
      onOrderExceptionErrorCallback,
      onOrderExceptionSuccessCallback,
      orderExceptionMutation,
    ]
  );
  // --- END: Data and handlers ------------------------------------------------

  return {
    addExceptionEvent,
    sendExceptionToApi,
  };
}
