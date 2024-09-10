import { useEffect, useMemo, useState } from "react";
import { useStore } from "@stores/zustand";
import { getCommentsByShipmentID } from "@hooks/SQLite/queries/comments.local.queries";

export function useCommentsData() {
  // --- Local State -----------------------------------------------------------------
  const [loading, setLoading] = useState<boolean>(true);
  // --- END: Local State ------------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const {
    comments,
    shipment: { shipmentID },
    addComments
  } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  useEffect(() => {
    if(shipmentID){
      getCommentsByShipmentID({ shipmentID }).then((values) => {
        addComments(values.map(({ comment }) => String(comment)))
      })
    }
  }, [shipmentID])

  const data = useMemo(() => {
    if (comments) {
      console.log({ comments });
      const filterValue = " Order Notes:";
      const notes = comments.find((value) => value.includes(filterValue));
      const filterComments = comments.filter(
        (value) => !value.includes(filterValue),
      );

      return { notes, comments: filterComments };
    }
    return undefined;
  }, [comments]);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side Effects ------------------------------------------------
  useEffect(() => {
    if (data) setLoading(false);
  }, [data])

  useEffect(() => {
    if (shipmentID)
      getCommentsByShipmentID({ shipmentID })
  }, [comments, shipmentID])
  // --- END: Side Effects -------------------------------------------

  return { data, loading };
}
