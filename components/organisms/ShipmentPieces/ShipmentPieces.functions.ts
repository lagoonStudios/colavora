import { useStore } from "@stores/zustand";
import { useState, useEffect } from "react";
import { PiecesLocalService } from "../../../db/repositories/pieces.repository";

export const usePiecesData = () => {
  // --- Local State ------------------------------------------------------------
  const [loading, setLoading] = useState<boolean>(true);
  // --- END: Local State ------------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { pieces, shipment, addPieces } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (shipment?.shipmentID) {
      PiecesLocalService.getAllByShipmentID(shipment.shipmentID).then(
        (values) => {
          addPieces(values);
        }
      );
    }
  }, [shipment?.shipmentID]);

  useEffect(() => {
    if (pieces) if (pieces?.length !== 0) setLoading(false);
  }, [pieces]);
  // --- END: Side effects -----------------------------------------------------

  return { data: pieces, loading };
};
