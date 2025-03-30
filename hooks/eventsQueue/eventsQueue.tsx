import { useIsConnected } from "react-native-offline";
import { useCallback, useEffect, useState } from "react";

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [queueIds, setQueueIds] = useState<number[]>([]);
  /** Represents all the ids that are being handled. For example all events that are waiting for an api response. */
  const [idsHandled, setHandledIds] = useState<number[]>([]);
  const [disableActions, setDisableActions] = useState(false);

  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const handleError = useCallback(
    (message: string, error?: unknown) => {
      console.error(message, error);
      setModalErrorModal(message);
    },
    [setModalErrorModal],
  );

  const updateQueueIds = (id: number, action: "add" | "remove") => {
    setQueueIds((prev) =>
      action === "add"
        ? [...prev.filter((item) => item !== id), id]
        : prev.filter((item) => item !== id),
    );
  };

  const updateHandledIds = (id: number, action: "add" | "remove") => {
    setHandledIds((prev) =>
      action === "add"
        ? [...prev.filter((item) => item !== id), id]
        : prev.filter((item) => item !== id),
    );
  };

  const addEventToQueue = useCallback(
    async (params: TInsertEventParams) => {
      try {
        const res = await insertEvent(params);
        updateQueueIds(res.id, "add");
      } catch (error) {
        handleError(
          "~ file: eventsQueue.tsx:60 ~ Error adding event to queue",
          error,
        );
      }
    },
    [handleError],
  );

  const removeEventFromQueue = useCallback(
    async (id: number) => {
      try {
        await removeEvent(id);
        updateQueueIds(id, "remove");
      } catch (error) {
        handleError("Error removing event from queue", error);
      }
    },
    [handleError],
  );

  const { addCompleteOrderEvent, completeOrderToApi } =
    useHandleCompleteOrderEvent({
      removeFromQueue: removeEventFromQueue,
      removeIdFromHandleList: (id) => updateHandledIds(id, "remove"),
      addEventToQueue,
    });

  const { addExceptionEvent, sendExceptionToApi } =
    useHandleOrderExceptionEvent({
      removeFromQueue: removeEventFromQueue,
      removeIdFromHandleList: (id) => updateHandledIds(id, "remove"),
      addEventToQueue,
    });

  /** Stores an completeOrder event in the queue.
   * @see {@link TCompleteOrderProps}
   */
  const completeOrder = useCallback(
    (order: TCompleteOrderProps) => {
      return new Promise((resolve, reject) => {
        if (!user) {
          const errorMessage =
            "~ file: eventsQueue.tsx:118 ~ completeOrder not found";
          handleError(errorMessage);
          reject(errorMessage);
          return;
        }

        addCompleteOrderEvent({ order })
          .then(() => resolve({ message: "Order added to queue", code: 200 }))
          .catch((error) => {
            handleError(
              "~ file: eventsQueue.tsx:129 ~ addCompleteOrderEvent: Error adding complete order event",
              error,
            );
            reject(error);
          });
      });
    },
    [addCompleteOrderEvent, handleError, user],
  );

  /** Stores an orderException event in the queue.
   * @see {@link TOrderExceptionsProps}
   */
  const orderException = useCallback(
    (data: Omit<TOrderExceptionsProps, "options">) => {
      return new Promise((resolve, reject) => {
        if (!user) {
          const errorMessage =
            "~ file: eventsQueue.tsx:146 ~ orderException: User not found";
          handleError(errorMessage);
          reject(errorMessage);
          return;
        }

        addExceptionEvent(data)
          .then(() =>
            resolve({ message: "Order exception stored locally", code: 200 }),
          )
          .catch((error) => {
            handleError(
              "~ file: eventsQueue.tsx:92 ~ addExceptionEvent: Error storing order exception locally",
              error,
            );
            reject(error);
          });
      });
    },
    [addExceptionEvent, handleError, user],
  );

  const handleEventsQueue = () => {
    if (disableActions) return;
    setDisableActions(true);
    getEventsQueue()
      .then((events) => {
        events.forEach((event) => {
          // If the event is already handled, skip it
          if (idsHandled.includes(event.id)) return;
          // Sets the eventId to the handledIds array
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
              handleError(
                "~ file: eventsQueue.tsx ~ handleEventsQueue: Event type not found or not handled",
              );
              break;
            }
          }
        });
        setDisableActions(false);
      })
      .catch((error) => handleError("Error processing events queue", error))
      .finally(() => setDisableActions(false));
  };
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    // To fill the queueIds state when hook is called for the first time.
    const fetchQueueIds = async () => {
      try {
        const ids = await getEventsQueuedIds();
        setQueueIds(ids);
      } catch (error) {
        handleError("Error fetching queued event IDs", error);
      }
    };

    void fetchQueueIds();
  }, [handleError, setQueueIds]);

  useEffect(() => {
    // Calls the function when the user is connected and the queue changes.
    if (isConnected && !visible) handleEventsQueue();

    if (visible) {
      setHandledIds([]);
      setDisableActions(false);
      setQueueIds([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsHandled, queueIds, isConnected, visible]);

  /* useEffect(() => console.log(queueIds, idsHandled), [queueIds, idsHandled]); */

  // -- END: Side effects -----------------------------------------------------

  return {
    completeOrder,
    orderException,
  };
}
