import { ShipmentLocalService } from "@/db/repositories/shipments.repository";
import { TShipmentListData } from "@/db/schema/shipments";
import { useEffect, useState } from "react";

export function useOrdersListData(shipmentIds: number[], manifest: string) {
  // --- Local state -----------------------------------------------------------
  const [loading] = useState(false);
  const [data, setData] = useState<TShipmentListData[]>([]);
  // --- END: Local state ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    // TODO: Pedir la nueva data cuando hago click en la manifest list
    if (shipmentIds) {
      void ShipmentLocalService.getShipmentList({ manifestID: manifest }).then(
        (value) => {
          const indexedValues = value.map((value, index) => ({
            ...value,
            index,
          }));
          setData(indexedValues);
        }
      );
    }
  }, [manifest, shipmentIds]);
  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading };
}
