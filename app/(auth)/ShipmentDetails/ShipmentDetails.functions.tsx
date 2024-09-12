import { IFetchShipmentByIdData } from "@constants/types/shipments";
import { getPiecesByShipmentID } from "@hooks/SQLite/queries/pieces.local.queries";
import { useStore } from "@stores/zustand";
import { useEffect, useState } from "react";

export const useShipmentDetailsData = () => {
  // --- Hooks -----------------------------------------------------------------
  const { shipment, addPieces } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<IFetchShipmentByIdData>();
  // --- END: Local state ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (shipment.shipmentID) {
      getPiecesByShipmentID({ shipmentID: shipment.shipmentID }).then(
        (values) => {
          addPieces(values);
        },
      );
    }
  }, [shipment.shipmentID]);

  useEffect(() => {
    if (shipment == undefined) {
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
