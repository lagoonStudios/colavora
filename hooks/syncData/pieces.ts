import { usePiecesByIdData, usePiecesIdData } from "@hooks/queries";
import { insertMultiplePieces } from "@hooks/SQLite/queries/pieces.local.queries";
import { useStore } from "@stores/zustand";
import { useEffect, useMemo, useState } from "react";

export function usePiecesFetch(){
  // --- Local State ------------------------------------------------------------
  const [success, setSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  // --- END: Local State ------------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const {
    shipment: { shipmentID },
    piecesIds,
    pieces,
    addPiecesIds,
    addPieces,
  } = useStore();
  const {
    data: piecesId
  } = usePiecesIdData({
    id: String(shipmentID),
  });
  const { data: piecesData } = usePiecesByIdData(piecesIds);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (piecesId) addPiecesIds(piecesId);
  }, [piecesId]);

  useEffect(() => {
    if (piecesData)
      if (piecesData?.length !== 0) {
        addPieces(piecesData);
        setSuccess(true);
        setLoading(false);
      }
  }, [piecesData]);

  useEffect(() => {
    if(pieces)
      if(pieces?.length !== 0)
        insertMultiplePieces(pieces)
  }, [pieces])
  // --- END: Side effects -----------------------------------------------------

  return { success, loading };
};
