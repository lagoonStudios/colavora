import { useEffect, useMemo, useState } from "react";
import { useStore } from "@stores/zustand";
import { CommentsLocalService } from "@/db/repositories/comments.repository";

export function useCommentsData() {
  // --- Local State -----------------------------------------------------------------
  const [loading, setLoading] = useState<boolean>(true);
  // --- END: Local State ------------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { comments, shipment, addComments } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  useEffect(() => {
    if (shipment?.shipmentID) {
      CommentsLocalService.getAll({ shipmentId: shipment.shipmentID }).then(
        (values) => {
          addComments(values);
        }
      );
    }
  }, [addComments, shipment?.shipmentID]);

  const data = useMemo(() => {
    if (comments) {
      const filterValue = " Order Notes:";
      const notes = comments.find(
        ({ comment }) => comment && comment.includes(filterValue)
      );
      const filterComments = comments.filter(
        ({ comment }) => comment && !comment.includes(filterValue)
      );

      return { notes, comments: filterComments };
    }
    return undefined;
  }, [comments]);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side Effects ------------------------------------------------
  useEffect(() => {
    if (data) setLoading(false);
  }, [data]);

  useEffect(() => {
    if (shipment?.shipmentID)
      void CommentsLocalService.getAll({ shipmentId: shipment.shipmentID });
  }, [comments, shipment?.shipmentID]);
  // --- END: Side Effects -------------------------------------------

  return { data, loading };
}
