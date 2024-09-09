import { useCallback, useEffect, useMemo, useState } from "react";
import { useIsConnected } from "react-native-offline";

import {
  insertEvent,
  removeEvent,
  getEventsQueue,
  getEventsQueuedIds,
} from "./eventsQueue.local.queries";

import {
  EventsQueueType,
  TInsertEventParams,
  TOrderExceptionsProps,
} from "./eventsQueue.types";
import {
  useAddComment,
  useCompleteOrder,
  useOrderException,
} from "@hooks/queries";
import { useStore } from "@stores/zustand";
import { insertMultipleComments } from "@hooks/SQLite/queries/comments.local.queries";
import { updateShipmentByException } from "@hooks/SQLite/queries/shipments.local.queries";
import { IOptionalCommentsProps } from "@constants/types/shipments";

export default function useEventsQueue() {
  // --- Hooks -----------------------------------------------------------------
  const isConnected = useIsConnected();
  const { user } = useStore();
  /** Represents all the events ids that are in the queue. */
  const [queueIds, setQueueIds] = useState<number[]>([]);
  /** Represents all the ids that are being handled. For example all events that are waiting for an api response. */
  const [idsHandled, setHandledIds] = useState<number[]>([]);

  const { mutate: completeOrderMutation } = useCompleteOrder();
  const { mutate: orderExceptionMutation } = useOrderException();
  const { mutate: addCommentMutation } = useAddComment();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const queueLength = useMemo(() => queueIds.length, [queueIds]);

  const addEventToQueue = useCallback(async (params: TInsertEventParams) => {
    return insertEvent(params).then((res) => {
      setQueueIds([...queueIds.filter((item) => item !== res.id), res.id]);
    });
  }, []);

  const removeEventFromQueue = useCallback((id: number) => {
    removeEvent(id).then(() => {
      removeIdFromHandleList(id);
      setQueueIds(queueIds.filter((item) => item !== id));
    });
  }, []);

  const setIdToHandleList = useCallback(
    (id: number) => setHandledIds((ids) => [...ids, id]),
    []
  );
  const removeIdFromHandleList = useCallback(
    (id: number) => setHandledIds((ids) => ids.filter((item) => item !== id)),
    []
  );

  /** Stores an completeOrder event in the queue. */
  const completeOrder = useCallback((id: number) => {}, []);

  /** Stores an orderException event in the queue. */
  const orderException = useCallback((data: TOrderExceptionsProps) => {
    return new Promise((resolve, reject) => {
      if (user == null) {
        console.error(
          "🚀 ~ file: eventsQueue.tsx:69 ~ orderException ~ user not defined:",
          user
        );
        reject("User not found");
        throw new Error("User not found");
      }
      const bodyShipment = JSON.stringify({
        comment: data.comment,
        companyID: user.companyID,
        shipmentID: data.shipmentID,
        reasonID: data.reasonID,
        photoImage: data.photoImage,
      });
      const bodyComment = JSON.stringify({
        companyID: user.companyID,
        userID: user.userID,
        shipmentID: data.shipmentID,
        comment: data.comment,
      });
      const commentToInsert = [
        {
          shipmentID: data.shipmentID,
          comment: data.comment,
          createdDate: data.commentCreatedDate,
        },
      ];

      // In the local db: Updates the is_sync state, inserts the comments and add the events to the queue.
      Promise.all([
        updateShipmentByException({
          isSync: false,
          shipmentID: data.shipmentID,
          reasonCode: data.reasonCode,
        }),
        insertMultipleComments(commentToInsert),
        addEventToQueue({
          body: bodyShipment,
          shipmentID: data.shipmentID,
          eventType: EventsQueueType.ORDER_EXCEPTION,
        }),
        addEventToQueue({
          body: bodyComment,
          shipmentID: data.shipmentID,
          eventType: EventsQueueType.ADD_COMMENT,
        }),
      ])
        .then((res) => {
          console.log("order exception queued");
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
  }, []);

  const handleEventsQueue = useCallback(() => {
    console.log("invoking handleEventsQueue");
    getEventsQueue().then((events) => {
      events.forEach((event) => {
        console.log("event type: ", event.eventType);

        // If the event is already handled, skip it
        if (idsHandled.includes(event.id)) return;

        // Sets the eventId to the handledIds array
        setIdToHandleList(event.id);

        // Handles the event based on its type
        switch (event.eventType) {
          // Order Exception
          case EventsQueueType.ORDER_EXCEPTION:
            const exceptionBody: TOrderExceptionsProps = JSON.parse(event.body);
            console.log("handling event: ", event.id);
            orderExceptionMutation({
              ...exceptionBody,
              removeFromQueue: removeEventFromQueue,
              eventId: event.id,
              removeIdFromHandleList,
            });
            break;

          // Complete Order
          case EventsQueueType.ORDER_COMPLETED:
            break;

          // Add Comment
          case EventsQueueType.ADD_COMMENT:
            const commentBody: IOptionalCommentsProps = JSON.parse(event.body);
            addCommentMutation({
              ...commentBody,
              removeFromQueue: removeEventFromQueue,
              eventId: event.id,
              removeIdFromHandleList,
            });
            break;

          // Shows an error message if the event type is not handled
          default:
            console.error(
              "🚀 ~ file: eventsQueue.tsx ~ handleEventsQueue ~ error:",
              "Event type not found or not handled"
            );
            break;
        }
      });
    });
  }, []);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isConnected) handleEventsQueue();
  }, [isConnected, queueLength]);

  useEffect(() => {
    // To fill all the state when the app is started
    const getIds = () => {
      getEventsQueuedIds().then((res) => {
        console.log("ids: ", res);
        setQueueIds(res);
      });
    };
    getIds();
  }, []);

  // -- END: Side effects -----------------------------------------------------

  return {
    completeOrder,
    orderException,
    removeEventFromQueue,
  };
}
