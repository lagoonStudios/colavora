import { useIsConnected } from "react-native-offline";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  insertEvent,
  removeEvent,
  getEventsQueue,
  getEventsQueuedIds,
} from "./eventsQueue.local.queries";
import { useAddComment, useOrderException } from "@hooks/queries";

import { useStore } from "@stores/zustand";

import {
  EventsQueueType,
  TCompleteOrderProps,
  TInsertEventParams,
  TOrderExceptionsProps,
} from "./eventsQueue.types";
import {
  useHandleCompleteOrderEvent,
  useHandleOrderExceptionEvent,
} from "./eventsQueue.functions";

export default function useEventsQueue() {
  // --- Hooks -----------------------------------------------------------------
  const isConnected = useIsConnected();
  const { user } = useStore();
  /** Represents all the events ids that are in the queue. */
  const [queueIds, setQueueIds] = useState<number[]>([]);
  /** Represents all the ids that are being handled. For example all events that are waiting for an api response. */
  const [idsHandled, setHandledIds] = useState<number[]>([]);

  const { mutate: orderExceptionMutation } = useOrderException();
  const { mutate: addCommentMutation } = useAddComment();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const queueLength = useMemo(() => queueIds.length, [queueIds]);

  const addEventToQueue = useCallback(async (params: TInsertEventParams) => {
    return insertEvent(params)
      .then((res) => {
        console.log("Adding event to queue: ", res.id);

        setQueueIds([...queueIds.filter((item) => item !== res.id), res.id]);
      })
      .catch((error) => {
        console.error(
          "🚀 ~ file: eventsQueue.tsx:47 ~ returninsertEvent ~ error:",
          error
        );
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

  const { addCompleteOrderEvent, completeOrderToApi } =
    useHandleCompleteOrderEvent({
      removeFromQueue: removeEventFromQueue,
      removeIdFromHandleList,
      addEventToQueue,
    });

  const { addExceptionEvent, sendExceptionToApi } =
    useHandleOrderExceptionEvent({
      removeFromQueue: removeEventFromQueue,
      removeIdFromHandleList,
      addEventToQueue,
    });

  /** Stores an completeOrder event in the queue.
   * @see {@link TCompleteOrderProps}
   */
  const completeOrder = useCallback((order: TCompleteOrderProps) => {
    return new Promise((resolve, reject) => {
      if (user == null) {
        console.error(
          "🚀 ~ file: eventsQueue.tsx:69 ~ orderException ~ user not defined:",
          user
        );
        reject("User not found");
        throw new Error("User not found");
      }

      addCompleteOrderEvent({ order })
        .then(() => {
          resolve({
            message: "Order added to queue",
            code: 200,
          });
        })
        .catch((error) => {
          console.error(
            "🚀 ~ file: eventsQueue.tsx:144 ~ addCompleteOrderEvent ~ error:",
            error
          );

          reject(error);
        });
    });
  }, []);

  /** Stores an orderException event in the queue.
   * @see {@link TOrderExceptionsProps}
   */
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

      addExceptionEvent(data)
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
    console.log("handleEventsQueue invoked");
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
            sendExceptionToApi(exceptionBody);
            break;

          // Complete Order
          case EventsQueueType.ORDER_COMPLETED:
            const orderBody: TCompleteOrderProps = JSON.parse(event.body);
            completeOrderToApi({
              order: orderBody,
              options: { eventId: event.id },
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

  // -- END: Side effects -----------------------------------------------------

  return {
    completeOrder,
    orderException,
  };
}
