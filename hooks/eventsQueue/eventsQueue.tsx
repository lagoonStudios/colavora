import { useCallback, useEffect, useMemo, useState } from "react";
import { useIsConnected } from "react-native-offline";

import {
  insertEvent,
  removeEvent,
  getEventsQueue,
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
import { updateShipmentByException } from "@hooks/SQLite";

export default function useEventsQueue() {
  // --- Hooks -----------------------------------------------------------------
  const isConnected = useIsConnected();
  const { user } = useStore();
  const [queueIds, setQueueIds] = useState<number[]>([]);

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
  const queueLength = useMemo(() => queueIds.length, [queueIds]);

  const addEventToQueue = useCallback(async (params: TInsertEventParams) => {
    return insertEvent(params).then((res) => {
      setQueueIds([...queueIds.filter((item) => item !== res.id), res.id]);
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
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    const asd = () => {
      getEventsQueue().then((res) => {
        console.log("queue length: ", res);
      });
      asd();
    };
  }, [queueLength]);

  //TODO llenar la cola al iniciar la app
  useEffect(() => {}, []);
  useEffect(() => {}, [isConnected]);
  // -- END: Side effects -----------------------------------------------------

  return {
    completeOrder,
    orderException,
  };
}
