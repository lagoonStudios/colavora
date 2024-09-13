import { getShipmentList } from "@hooks/SQLite";
import { IFetchOrderListItem } from "@hooks/SQLite/SQLite.types";
import { useEffect, useState } from "react";

export function useOrdersListData(shipmentIds: number[], manifest: string) {
  // --- Local state -----------------------------------------------------------
  const [loading] = useState(false);
  const [data, setData] = useState<IFetchOrderListItem[]>([]);
  // --- END: Local state ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    /* TODO: Pedir la nueva data cuando hago click en la manifest list */
    if (shipmentIds) {
      void getShipmentList({ manifestID: manifest }).then((values) => {
        const indexedValues = values.map((value, index) => ({
          ...value,
          index,
        }));
        setData(indexedValues);
      });
    }
  }, [manifest, shipmentIds]);
  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading };
}
