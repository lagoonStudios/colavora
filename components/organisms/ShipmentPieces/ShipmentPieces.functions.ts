import { usePiecesByIdData, usePiecesIdData } from "@hooks/queries";
import { useStore } from "@stores/zustand";
import { useEffect, useMemo } from "react";

export const usePiecesData = () => {
  // --- Hooks -----------------------------------------------------------------
  const {
    shipment: { shipmentID },
    piecesIds,
    pieces,
    addPiecesIds,
    addPieces,
  } = useStore();
  const {
    data: piecesId,
    isSuccess,
    isLoading,
  } = usePiecesIdData({
    id: String(shipmentID),
  });
  const { data: piecesData, pending } = usePiecesByIdData(piecesIds);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isSuccess) addPiecesIds(piecesId);
  }, [addPiecesIds, isSuccess, piecesId]);

  useEffect(() => {
    if (pending === false) addPieces(piecesData);
  }, [addPieces, pending, piecesData]);
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const loading = useMemo(() => isLoading, [isLoading]);
  // --- END: Data and handlers ------------------------------------------------

  return { data: pieces, loading };
};
