import { IFetchShipmentByIdData } from "@constants/types/shipments";
import { getShipmentList } from "@hooks/SQLite";
import { useEffect, useState } from "react";

export function useOrdersListData(shipmentIds: number[], manifest: string) {
  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IFetchShipmentByIdData[]>([]);
  // --- END: Local state ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    /* TODO: Pedir la nueva data cuando hago click en la manifest list */
    if (shipmentIds?.length > 0) {
      getShipmentList({ manifestID: manifest }).then((values) => {
        setData(values)
      })
    }
  }, [shipmentIds]);

  useEffect(() => {
    if (data.length !== 0) setLoading(false);
  }, [data]);
  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}
