import { getPiecesByShipmentID } from "@hooks/SQLite/queries/pieces.local.queries";
import { useStore } from "@stores/zustand";
import { useState, useEffect } from "react";

export const usePiecesData = () => {
  // --- Local State ------------------------------------------------------------
  const [loading, setLoading] = useState<boolean>(true)
  // --- END: Local State ------------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const {
    pieces,
    shipment: { shipmentID },
    addPieces
  } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (shipmentID) {
      getPiecesByShipmentID({ shipmentID }).then((values) => {
        addPieces(values)
      })
    }
  }, [shipmentID]);

  useEffect(() => {
    if (pieces)
      if (pieces?.length !== 0)
        setLoading(false);
  }, [pieces])
  // --- END: Side effects -----------------------------------------------------

  return { data: pieces, loading };
};
