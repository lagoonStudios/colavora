import { useEffect, useMemo, useState } from "react";

import { useStore } from "@stores/zustand";
import { getHomeCounters } from "@hooks/SQLite/queries/general.local.queries";

import { HomeItem } from "./Home.types";

export function useHomeData() {
  // --- Hooks -----------------------------------------------------------------
  const { manifestIds, shipmentIds, isSyncing, shipment } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);

  const [totalManifests, setTotalManifests] = useState<number>();
  const [totalOrdersForToday, setTotalOrdersForToday] = useState<number>();
  // --- END: Local state ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isSyncing === false) {
      void getHomeCounters().then((data) => {
        setTotalManifests(data.manifests);
        setTotalOrdersForToday(data.todayShipments);
        setLoading(false);
      });
    }
  }, [isSyncing, manifestIds, shipment]);
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const data: HomeItem[] = useMemo(
    () => [
      {
        counter: `${totalOrdersForToday}`,
        description: "HOME.DELIVERIES_FOR_TODAY",
        route: "ordersForToday",
        isDisabled: false,
        data: shipmentIds,
      },
      {
        counter: `${totalManifests}`,
        description: "HOME.DELIVERY_MANIFEST",
        route: "manifests",
        isDisabled: false,
      },
      // TO DO: Para otra iteracion
      /* {
        counter: "0",
        description: "HOME.PICKUPS_FOR_TODAY",
        route: "",
        isDisabled: true,
      },
      {
        counter: "0",
        description: "HOME.PICKUP_MANIFEST",
        route: "",
        isDisabled: true,
      }, */
    ],
    [shipmentIds, totalManifests, totalOrdersForToday],
  );
  // --- END: Data and handlers ------------------------------------------------

  return { data, loading, setLoading };
}
