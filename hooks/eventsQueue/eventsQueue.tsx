import { useCallback, useEffect, useMemo, useState } from "react";
import { useIsConnected } from "react-native-offline";

import { insertEvent, removeEvent } from "./eventsQueue.local.queries";

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

export default function useEventsQueue() {
  // --- Hooks -----------------------------------------------------------------
  const isConnected = useIsConnected();
  const { user } = useStore();
  const [queueIds, setQueueIds] = useState<number[]>([]);
  const queueLength = useMemo(() => queueIds.length, [queueIds]);

  const {
    mutate: completeOrderMutation,
    status: completeOrderStatus,
    error: completeOrderError,
  } = useCompleteOrder();
  const {
    mutate: orderExceptionMutation,
    status: orderExceptionStatus,
    error: orderExceptionError,
  } = useOrderException();
  const {
    mutate: addCommentMutation,
    status: addCommentStatus,
    error: addCommentError,
  } = useAddComment();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const addEventToQueue = useCallback((params: TInsertEventParams) => {
    return insertEvent(params).then(() => {
      setQueueIds([...queueIds, params.shipmentID]);
    });
  }, []);

  const removeEventFromQueue = useCallback((id: number) => {
    removeEvent(id).then(() => {
      setQueueIds(queueIds.filter((item) => item !== id));
    });
  }, []);

  /** Stores an completeOrder event in the queue. */
  const completeOrder = useCallback((id: number) => {}, []);

  /** Stores an orderException event in the queue. */
  const orderException = useCallback((data: TOrderExceptionsProps) => {
    const body = JSON.stringify(data);
    // const commentToInsert = [
    //   {
    //     shipmentID: data.shipmentID,
    //     comment: data.comment,
    //     createdDate: data.commentCreatedDate,
    //   },
    // ];
    // insertMultipleComments(commentToInsert);
    addEventToQueue({
      body,
      shipmentID: data.shipmentID,
      eventType: EventsQueueType.ORDER_EXCEPTION,
    });
  }, []);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isConnected) {
    }
  }, [isConnected]);

  useEffect(() => {});
  // -- END: Side effects -----------------------------------------------------

  return {
    completeOrder,
    orderException,
  };
}
