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
  const { data: shipmentIds } =
    useShipmentsIdData({
      manifest: todayManifest ? String(todayManifest) : undefined,
    });

  const { data: shipments, pending } = useShipmentsByIdData(shipmentIds ?? []);
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
    if (pending === false)
      if (shipments?.length && shipments?.length !== 0)
        insertMultipleShipments(shipments).then(() => {
          setLoading(false);
          setSuccess(true);
        });
  }, [shipments, pending])
  // --- END: Side effects -----------------------------------------------------

  return { success, loading };
}