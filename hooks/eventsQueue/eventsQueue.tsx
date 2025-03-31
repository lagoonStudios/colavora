import { useIsConnected } from "react-native-offline";
import { useEffect, useMemo, useState } from "react";

import {
  insertEvent,
  removeEvent,
  getEventsQueue,
  getEventsQueuedIds,
} from "./eventsQueue.local.queries";

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
  const {
    user,
    setModalErrorModal,
    errorModal: { visible },
  } = useStore();
  /** Represents all the events ids that are in the queue. */
  const [queueIds, setQueueIds] = useState<number[]>([]);
  /** Represents all the ids that are being handled. For example all events that are waiting for an api response. */
  const [idsHandled, setHandledIds] = useState<number[]>([]);
  const [disableActions, setDisableActions] = useState(false);

  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const queueLength = useMemo(() => queueIds.length, [queueIds]);

  const addEventToQueue = async (params: TInsertEventParams) => {
    return insertEvent(params)
      .then((res) => {
        setQueueIds([...queueIds.filter((item) => item !== res.id), res.id]);
      })
      .catch((error) => {
        setModalErrorModal(`${error}`);
        console.error(
          "🚀 ~ file: eventsQueue.tsx:47 ~ returninsertEvent ~ error:",
          error,
        );
      });
  };
  const removeIdFromHandleList = (id: number) =>
    setHandledIds((ids) => ids.filter((item) => item !== id));

  const removeEventFromQueue = (id: number) => {
    removeEvent(id)
      .then(() => {
        // removeIdFromHandleList(id);
        setQueueIds(queueIds.filter((item) => item !== id));
      })
      .catch((e) => {
        setModalErrorModal(`${e}`);
        console.error("🚀 ~ file: eventsQueue.tsx:65 ~ removeEvent ~ e:", e);
      });
  };

  const setIdToHandleList = (id: number) =>
    setHandledIds((ids) => [...ids.filter((v) => v !== id), id]);

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
  const completeOrder = (order: TCompleteOrderProps) => {
    return new Promise((resolve, reject) => {
      if (user == null) {
        console.error(
          "🚀 ~ file: eventsQueue.tsx:69 ~ orderException ~ user not defined:",
          user,
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
          setModalErrorModal(`${error}`);
          console.error(
            "🚀 ~ file: eventsQueue.tsx:144 ~ addCompleteOrderEvent ~ error:",
            error,
          );

          reject(error);
        });
    });
  };

  /** Stores an orderException event in the queue.
   * @see {@link TOrderExceptionsProps}
   */
  const orderException = (data: Omit<TOrderExceptionsProps, "options">) => {
    return new Promise((resolve, reject) => {
      if (user == null) {
        console.error(
          "🚀 ~ file: eventsQueue.tsx:69 ~ orderException ~ user not defined:",
          user,
        );
        reject("User not found");
        throw new Error("User not found");
      }

      addExceptionEvent(data)
        .then(() => {
          resolve({
            message: "Order exception stored locally",
            code: 200,
          });
        })
        .catch((error) => {
          setModalErrorModal(`${error}`);
          console.error(
            "🚀 ~ file: eventsQueue.tsx:92 ~ orderException ~ error:",
            error,
          );
          reject(error);
        });
    });
  };

  const handleEventsQueue = () => {
    if (disableActions) return;
    setDisableActions(true);
    getEventsQueue()
      .then((events) => {
        events.forEach((event) => {
          // If the event is already handled, skip it
          if (idsHandled.includes(event.id)) return;
          // Sets the eventId to the handledIds array
          setIdToHandleList(event.id);
          // Handles the event based on its type
          switch (event.eventType) {
            // Order Exception
            case EventsQueueType.ORDER_EXCEPTION: {
              const exceptionBody: TOrderExceptionsProps = JSON.parse(
                event.body,
              ) as TOrderExceptionsProps;
              sendExceptionToApi({
                ...exceptionBody,
                options: { eventId: event.id },
              });
              break;
            }
            // Complete Order
            case EventsQueueType.ORDER_COMPLETED: {
              const orderBody: TCompleteOrderProps = JSON.parse(
                event.body,
              ) as TCompleteOrderProps;
              completeOrderToApi({
                order: orderBody,
                options: { eventId: event.id },
              });
              break;
            }
            // Shows an error message if the event type is not handled
            default: {
              setModalErrorModal(`Event type not found or not handled`);
              console.error(
                "🚀 ~ file: eventsQueue.tsx ~ handleEventsQueue ~ error:",
                "Event type not found or not handled",
              );
              break;
            }
          }
        });
        setDisableActions(false);
      })
      .catch((e) => {
        setModalErrorModal(`${e}`);
        console.error(
          "🚀 ~ file: eventsQueue.tsx:191 ~ getEventsQueue ~ e:",
          e,
        );
      })
      .finally(() => setDisableActions(false));
  };
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    // To fill the queueIds state when hook is called for the first time.
    const getIds = () => {
      getEventsQueuedIds()
        .then((res) => {
          setQueueIds(res);
        })
        .catch((error) => {
          setModalErrorModal(`${error}`);
          console.error(
            "🚀 ~ file: eventsQueue.tsx:217 ~ getEventsQueuedIds ~ error:",
            error,
          );
        });
    };
    getIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setQueueIds]);

  useEffect(() => {
    // Calls the function when the user is connected and the queue changes.
    if (isConnected && !visible) handleEventsQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsHandled, isConnected, visible]);

  // -- END: Side effects -----------------------------------------------------

  return {
    completeOrder,
    orderException,
  };
}
