import { useIsConnected } from "react-native-offline";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  insertEvent,
  removeEvent,
  getEventsQueue,
  getEventsQueuedIds,
} from "./eventsQueue.local.queries";
import { insertMultipleComments } from "@hooks/SQLite/queries/comments.local.queries";
import { updateShipmentByException } from "@hooks/SQLite/queries/shipments.local.queries";
import {
  useAddComment,
  useCompleteOrder,
  useOrderException,
  useSendCODs,
} from "@hooks/queries";

import { useStore } from "@stores/zustand";

import {
  EventsQueueType,
  TInsertEventParams,
  TOrderExceptionsProps,
} from "./eventsQueue.types";
import { IOptionalCommentsProps, ISendCOD } from "@constants/types/shipments";

export default function useEventsQueue() {
  // --- Hooks -----------------------------------------------------------------
  const isConnected = useIsConnected();
  const { user } = useStore();
  /** Represents all the events ids that are in the queue. */
  const [queueIds, setQueueIds] = useState<number[]>([]);
  /** Represents all the ids that are being handled. For example all events that are waiting for an api response. */
  const [idsHandled, setHandledIds] = useState<number[]>([]);

  const { mutate: sendCODMutation } = useSendCODs();
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

  const sendCODS = useCallback((cods: ISendCOD[]) => {
    return new Promise((resolve, reject) => {
      if (user == null) {
        console.error(
          "🚀 ~ file: eventsQueue.tsx:69 ~ orderException ~ user not defined:",
          user
        );
        reject("User not found");
        throw new Error("User not found");
      }

      const promises: Promise<void>[] = [];

      cods.forEach((cod) => {
        const bodyCODs = JSON.stringify({
          ...cod,
          companyID: user.companyID,
          userID: user.userID,
          shipmentID: cod.shipmentID,
          codAmount: cod.codAmount,
          codCheck: cod.codCheck,
          codTypeID: cod.codTypeID,
        });
        const promise = addEventToQueue({
          body: bodyCODs,
          shipmentID: cod.shipmentID,
          eventType: EventsQueueType.SEND_CODS,
        });
        promises.push(promise);
      });
      Promise.all(promises)
        .then((res) => {
          resolve({
            message: "CODS stored locally",
            code: 200,
          });
        })
        .catch((error) => {
          console.error(
            "🚀 ~ file: eventsQueue.tsx:108 ~ sendCODS ~ error:",
            error
          );
        });
    });
  }, []);

  /** Stores an completeOrder event in the queue. */
  const completeOrder = useCallback(() => {
    return new Promise((resolve, reject) => {
      reject("Not implemented");
    });
  }, []);

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
    getEventsQueue().then((events) => {
      events.forEach((event) => {
        // If the event is already handled, skip it
        if (idsHandled.includes(event.id)) return;

        // Sets the eventId to the handledIds array
        setIdToHandleList(event.id);
        // Handles the event based on its type
        switch (event.eventType) {
          // Order Exception
          case EventsQueueType.ORDER_EXCEPTION:
            const exceptionBody: TOrderExceptionsProps = JSON.parse(event.body);
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
    // To fill the queueIds state when hook is called for the first time.
    const getIds = () => {
      getEventsQueuedIds().then((res) => {
        setQueueIds(res);
      });
    };
    getIds();
  }, []);

  useEffect(() => {
    // Calls the function when the user is connected and the queue changes.
    if (isConnected) handleEventsQueue();
  }, [isConnected, queueLength]);

  // useEffect(() => {
  //   console.log("idsHandled", idsHandled);
  // }, [idsHandled]);
  // -- END: Side effects -----------------------------------------------------

  return {
    completeOrder,
    sendCODS,
    orderException,
  };
}
