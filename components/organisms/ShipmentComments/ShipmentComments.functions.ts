import { useCommentsIdData } from "@hooks/queries";
import { useStore } from "@stores/zustand";
import { useEffect, useMemo } from "react";

export function useCommentsData() {
  // --- Hooks -----------------------------------------------------------------
  const {
    shipment: { shipmentID },
    addComments,
    comments,
  } = useStore();
  const {
    data: rawComments,
    isSuccess,
    isLoading: loading,
    refetch,
  } = useCommentsIdData({ id: String(shipmentID) });
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isSuccess) addComments(rawComments);
  }, [addComments, isSuccess, rawComments]);
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const data = useMemo(() => {
    if (comments) {
      const notes = comments.find((value) => value.includes(" Order Notes:"));
      const filterComments = comments.filter(
        (value) => !value.includes(" Order Notes:"),
      );

      return { notes, comments: filterComments };
    }
    return undefined;
  }, [comments]);
  // --- END: Data and handlers ------------------------------------------------

  return { data, loading, refetch };
}
