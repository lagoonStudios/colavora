import { IFetchShipmentByIdData } from "@constants/types";
import { useShipmentsByIdData } from "@hooks/queries";
import { useEffect, useState } from "react";

export function useOrdersListData(shipmentIds: number[]) {
  // --- Hooks -----------------------------------------------------------------
  const { data: dataShipments, pending } = useShipmentsByIdData(
    shipmentIds?.slice(0, 20),
  );
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [data, setData] = useState<IFetchShipmentByIdData[]>([]);
  const [loading, setLoading] = useState(true);
  // --- END: Local state ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (pending === false && dataShipments) {
      setData(dataShipments?.map((shipment) => shipment));
    }
  }, [pending, dataShipments]);

  useEffect(() => {
    if (data.length !== 0) setLoading(false);
  }, [data]);
  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}
