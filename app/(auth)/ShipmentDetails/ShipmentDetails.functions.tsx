import { PiecesLocalService } from "@/db/repositories/pieces.repository";
import { TPiecesInsertData } from "@/db/schema/pieces";
import { TShipmentsData } from "@/db/schema/shipments";
import { useStore } from "@stores/zustand";
import { useEffect, useState } from "react";

export const useShipmentDetailsData = () => {
  // --- Hooks -----------------------------------------------------------------
  const { shipment, addPieces } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TShipmentsData | null>(null);
  // --- END: Local state ------------------------------------------------------------

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
    if (shipment === null) {
      setError(new Error("No shipment ID provided"));
      return;
    }

    setData(shipment);
  }, [shipment]);

  useEffect(() => {
    if (data) setLoading(false);
  }, [data]);

  // --- END: Side effects -----------------------------------------------------
  return { loading, error, data };
};
