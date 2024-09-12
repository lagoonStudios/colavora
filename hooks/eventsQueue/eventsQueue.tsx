import { useIsConnected } from "react-native-offline";
import { useCallback, useEffect, useMemo, useState } from "react";

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
  const { user, isSyncing } = useStore();
  /** Represents all the events ids that are in the queue. */
  const [queueIds, setQueueIds] = useState<number[]>([]);
  /** Represents all the ids that are being handled. For example all events that are waiting for an api response. */
  const [idsHandled, setHandledIds] = useState<number[]>([]);
  const [disableActions, setDisableActions] = useState(false);

  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const queueLength = useMemo(() => queueIds.length, [queueIds]);

  const addEventToQueue = useCallback(
    async (params: TInsertEventParams) => {
      return insertEvent(params)
        .then((res) => {
          setQueueIds([...queueIds.filter((item) => item !== res.id), res.id]);
        })
        .catch((error) => {
          console.error(
            "🚀 ~ file: eventsQueue.tsx:47 ~ returninsertEvent ~ error:",
            error
          );
        });
    },
    [queueIds]
  );
  const removeIdFromHandleList = useCallback(
    (id: number) => setHandledIds((ids) => ids.filter((item) => item !== id)),
    [setHandledIds]
  );
  const removeEventFromQueue = useCallback(
    (id: number) => {
      removeEvent(id)
        .then(() => {
          // removeIdFromHandleList(id);
          setQueueIds(queueIds.filter((item) => item !== id));
        })
        .catch((e) => {
          console.error("🚀 ~ file: eventsQueue.tsx:65 ~ removeEvent ~ e:", e);
        });
    },
    [queueIds, setQueueIds]
  );

  const setIdToHandleList = useCallback(
    (id: number) =>
      setHandledIds((ids) => [...ids.filter((v) => v !== id), id]),
    [setHandledIds]
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
  const completeOrder = useCallback(
    (order: TCompleteOrderProps) => {
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
    },
    [addCompleteOrderEvent, user]
  );

  /** Stores an orderException event in the queue.
   * @see {@link TOrderExceptionsProps}
   */
  const orderException = useCallback(
    (data: Omit<TOrderExceptionsProps, "options">) => {
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
    [addExceptionEvent, user]
  );

  const handleEventsQueue = useCallback(() => {
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
              setIdToHandleList(event.id);
              const exceptionBody: TOrderExceptionsProps = JSON.parse(
                event.body
              );
              sendExceptionToApi({
                ...exceptionBody,
                options: { eventId: event.id },
              });
              break;
            }
            // Complete Order
            case EventsQueueType.ORDER_COMPLETED: {
              const orderBody: TCompleteOrderProps = JSON.parse(event.body);
              completeOrderToApi({
                order: orderBody,
                options: { eventId: event.id },
              });
              break;
            }
            // Shows an error message if the event type is not handled
            default: {
              console.error(
                "🚀 ~ file: eventsQueue.tsx ~ handleEventsQueue ~ error:",
                "Event type not found or not handled"
              );
              break;
            }
          }
        });
        setDisableActions(false);
      })
      .catch((e) => {
        console.error(
          "🚀 ~ file: eventsQueue.tsx:191 ~ getEventsQueue ~ e:",
          e
        );
        setDisableActions(false);
      });
    // No se agrega el idHandled porque dentro del callback se está seteando el idHandled y ocurre un loop infinito.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeOrderToApi, sendExceptionToApi]);
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
          console.error(
            "🚀 ~ file: eventsQueue.tsx:217 ~ getEventsQueuedIds ~ error:",
            error
          );
        });
    };
    getIds();
  }, [setQueueIds]);

  useEffect(() => {
    // Calls the function when the user is connected and the queue changes.
    if (isConnected) handleEventsQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, queueLength]);

  // -- END: Side effects -----------------------------------------------------

  return {
    completeOrder,
    orderException,
  };
}
