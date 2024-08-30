import { useEffect, useState } from "react";

import { useStore } from "@stores/zustand";
import { useCommentsIdData } from "@hooks/queries";
import { insertMultipleComments } from "@hooks/SQLite/queries/comments.local.queries";

export function useCommentsFetch() {
  // --- Local State  -----------------------------------------------------------------  
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  // --- END: Local State ------------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const {
    shipment: { shipmentID },
    addComments,
    comments,
  } = useStore();
  const {
    data: rawComments,
    refetch,
  } = useCommentsIdData({ id: String(shipmentID) });
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (rawComments)
      addComments(rawComments);
  }, [rawComments]);

  useEffect(() => {
    if (comments && shipmentID) {
      const commentsToInsert = comments?.map((item) => {
        const splittedComment = item.split(")");
        const date = splittedComment[0].slice(1);
        return {
          shipmentID: shipmentID, comment: item, createdDate: date
        }
      })

      insertMultipleComments(commentsToInsert).then(() => {
        setSuccess(true);
        setLoading(false);
      })

    }
  }, [comments])
  // --- END: Side effects -----------------------------------------------------

  return { loading, refetch, success };
}
