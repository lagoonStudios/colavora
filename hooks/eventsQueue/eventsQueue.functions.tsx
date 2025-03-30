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
import {
  deleteShipment,
  getEventsByID,
  updateShipmentByException,
} from "./eventsQueue.local.queries";
import { CompleteOrderMutationProps } from "@constants/types/shipments";
import { useStore } from "@stores/zustand";
import { insertMultipleComments } from "@hooks/SQLite/queries/comments.local.queries";
import { IFetchUserData } from "@constants/types/general";

// Utility function for error handling
const handleError = (message: string, data?: unknown) => {
  console.error(message, data);
  throw new Error(message);
};

const handleEventIdError = (eventId: unknown, context: string) => {
  if (eventId == null) {
    handleError(`${context} - Event ID not found`, { eventId });
  }
};

const handleUserError = ({
  user,
  context,
}: {
  user: IFetchUserData | null;
  context: string;
}) => {
  if (user === null) handleError(`${context} - User not defined`, { user });
};

export function useHandleCompleteOrderEvent({
  removeFromQueue,
  removeIdFromHandleList,
  addEventToQueue,
}: TUseEventsProps) {
  // --- Hooks -----------------------------------------------------------------
  const { mutate: completeOrderMutation } = useCompleteOrder();
  const { mutate: sendCODMutation } = useSendCODs();
  const { setSyncing, setModalErrorModal } = useStore();
  // --- END: Hooks ------------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------
  const handleCODSErrorCallback = useCallback(
    ({ options: { eventId } }: TSendCODSProps) => {
      if (eventId != null) {
        removeIdFromHandleList(eventId);
      } else {
        handleError(
          "~ file: eventsQueue.functions.ts:44 ~ Event ID not found in handleCODSErrorCallback",
        );
      }
    },
    [removeIdFromHandleList],
  );

  const handleCompleteOrderSuccessCallback = useCallback(
    ({
      order: { shipmentID },
      options: { eventId },
    }: CompleteOrderMutationProps) => {
      if (eventId && shipmentID) {
        removeIdFromHandleList(eventId);
        void removeFromQueue(eventId);
        setSyncing(false);
      } else {
        handleError(
          "~ file: eventsQueue.functions.ts:56 ~ Event ID or Shipment ID not found in handleCompleteOrderSuccessCallback",
          {
            eventId,
            shipmentID,
          },
        );
      }
    },
    [removeFromQueue, removeIdFromHandleList, setSyncing],
  );

  const handleCompleteOrderErrorCallback = useCallback(
    ({ options: { eventId } }: CompleteOrderMutationProps) => {
      if (eventId) {
        removeIdFromHandleList(eventId);
      } else {
        handleError(
          "~ file: eventsQueue.functions.ts:78 ~ Event ID not found in handleCompleteOrderErrorCallback",
        );
      }
    },
    [removeIdFromHandleList],
  );
  const addCompleteOrderEvent = useCallback(
    async ({ order }: TAddCompleteOrderToQueue) => {
      try {
        const body = JSON.stringify(order);
        await addEventToQueue({
          body,
          eventType: EventsQueueType.ORDER_COMPLETED,
          shipmentID: order.shipmentID,
        });
        setSyncing(true);
        await deleteShipment({ shipmentID: order.shipmentID });
        setSyncing(false);
        return { message: "Order added to queue", code: 200 };
      } catch (error) {
        setSyncing(false);
        setModalErrorModal(`${String(error)}`);
        handleError(
          "~ file: eventsQueue.tsx:144 ~ deleteShipment: Error adding complete order event",
          error,
        );
      }
    },
    [addEventToQueue, setModalErrorModal, setSyncing],
  );

  const handleUploadCompleteOrder = useCallback(
    async (eventId: number) => {
      try {
        const res = await getEventsByID(eventId);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const order: Omit<TCompleteOrderProps, "options"> = JSON.parse(
          res.body,
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
      } catch (error) {
        setModalErrorModal(`${String(error)}`);
        handleError(
          "~ file: eventsQueue.functions.ts:118 ~ Error in handleUploadCompleteOrder",
          error,
        );
      }
    },
    [
      completeOrderMutation,
      handleCompleteOrderErrorCallback,
      handleCompleteOrderSuccessCallback,
      setModalErrorModal,
    ],
  );

  const handleCODSSuccessCallback = useCallback(
    ({ options: { eventId } }: TSendCODSProps) => {
      if (eventId) void handleUploadCompleteOrder(eventId);
      else
        handleError(
          "~ file: eventsQueue.functions.ts:47 ~ Event ID not found in handleCODSSuccessCallback",
        );
    },
    [handleUploadCompleteOrder],
  );

  const completeOrderToApi = useCallback(
    ({ order, options: { eventId } }: TCompleteOrderToApiProps) => {
      const cods = order.completeCODs;
      if (cods.length > 0)
        sendCODMutation({
          CODS: cods,
          options: {
            eventId,
            onError: handleCODSErrorCallback,
            onSuccess: handleCODSSuccessCallback,
          },
        });
      else void handleUploadCompleteOrder(eventId);
    },
    [
      handleCODSErrorCallback,
      handleCODSSuccessCallback,
      handleUploadCompleteOrder,
      sendCODMutation,
    ],
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
  const { user, reasons, setModalErrorModal } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onOrderExceptionErrorCallback = useCallback(
    ({ options: { eventId } }: TOrderExceptionsProps) => {
      if (eventId !== null) removeIdFromHandleList(eventId);
      else handleEventIdError(eventId, "onOrderExceptionErrorCallback");
    },
    [removeIdFromHandleList],
  );

  const onSendCommentErrorCallback = useCallback(
    ({ options: { eventId } }: TOrderExceptionsProps) => {
      if (eventId !== null) removeIdFromHandleList(eventId);
      else
        handleEventIdError(
          eventId,
          "~ file: eventsQueue.functions.ts:47 ~ onSendCommentErrorCallback",
        );
    },
    [removeIdFromHandleList],
  );

  const onSendCommentSuccessCallback = useCallback(
    ({ options: { eventId } }: TOrderExceptionsProps) => {
      handleEventIdError(eventId, "onSendCommentSuccessCallback");
      if (eventId !== null) {
        removeIdFromHandleList(eventId);
        void removeFromQueue(eventId);
      } else {
        handleError(
          "~ file: eventsQueue.functions.ts:47 ~ Event ID not found in onSendCommentSuccessCallback",
        );
      }
    },
    [removeIdFromHandleList, removeFromQueue],
  );

  /**
   * Stores an orderException event in the queue.
   * @see {@link TOrderExceptionsProps}
   */
  const addExceptionEvent = useCallback(
    (data: Omit<TOrderExceptionsProps, "options">) => {
      return new Promise((resolve, reject) => {
        handleUserError({
          user,
          context:
            "~ file: eventsQueue.functions.ts:47 ~ addExceptionEvent ~ user not defined",
        });

        if (user === null)
          throw new Error(
            "~ file: eventsQueue.functions.ts:47 ~ addExceptionEvent ~ user not defined",
          );

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
          .then(() =>
            resolve({ message: "Order exception stored locally", code: 200 }),
          )
          .catch((error) => {
            setModalErrorModal(`${error}`);
            handleError(
              "~ file: eventsQueue.tsx:92 ~ orderException: Error storing order exception locally",
              error,
            );
            reject(error);
          });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addEventToQueue, user],
  );

  const sendCommentToApi = useCallback(
    (data: TOrderExceptionsProps) => {
      handleUserError({
        user,
        context: "~ file: eventsQueue.functions.ts:47 ~ sendCommentToApi",
      });
      if (user === null)
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ sendCommentToApi ~ user not defined:",
        );

      const selectedReasonLabel =
        reasons?.find(({ reasonID }) => reasonID === Number(data.reasonID))
          ?.reasonCodeDesc || "";

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
    ],
  );

  const onOrderExceptionSuccessCallback = useCallback(
    (props: TOrderExceptionsProps) => {
      if (props.options.eventId != null) sendCommentToApi(props);
      else {
        console.error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionSuccessCallback ~ eventId:",
          props.options.eventId,
        );
        throw new Error(
          "🚀 ~ file: eventsQueue.functions.ts:47 ~ handleOrderExceptionSuccessCallback ~ eventId not found",
        );
      }
    },
    [sendCommentToApi],
  );

  /**
   * Sends an orderException event to the API.
   * Then calls a callback if succeeded to send the comment to the API.
   * @see {@link TOrderExceptionsProps}
   */
  const sendExceptionToApi = useCallback(
    (data: TOrderExceptionsProps) => {
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
    ],
  );
  // --- END: Data and handlers ------------------------------------------------

  return {
    addExceptionEvent,
    sendExceptionToApi,
  };
}
