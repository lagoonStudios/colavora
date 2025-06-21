import { useState, useEffect } from "react";
import { useShipmentsIdData, useShipmentsByIdData } from "@hooks/queries";
import { insertMultipleShipments } from "@hooks/SQLite/queries/shipments.local.queries";
import { useStore } from "@stores/zustand";

export function useShipmentFetch() {
  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [todayManifest, setTodayManifest] = useState<number>();
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { manifestIds, addShipmentIds } = useStore();
  const { data: shipmentIds } = useShipmentsIdData({
    manifest: todayManifest ? String(todayManifest) : undefined,
  });

  const dataShipments = useShipmentsByIdData(shipmentIds ?? []);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (manifestIds && manifestIds?.[0]) setTodayManifest(manifestIds?.[0]);
  }, [manifestIds]);

  useEffect(() => {
    if (shipmentIds?.length && shipmentIds?.length !== 0)
      addShipmentIds(shipmentIds);
  }, [shipmentIds]);

  useEffect(() => {
    if (dataShipments?.pending === false)
      if (dataShipments?.data?.length && dataShipments?.data?.length !== 0)
        insertMultipleShipments(dataShipments?.data).then(() => {
          setLoading(false);
          setSuccess(true);
        });
  }, [dataShipments]);
  // --- END: Side effects -----------------------------------------------------

  return { success, loading };
}
