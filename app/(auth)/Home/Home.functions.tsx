import { useEffect, useState } from "react";
import { HomeItem } from "./Home.types";

export function useHomeData() {
  // --- Local state -----------------------------------------------------------
  const [data, setData] = useState<HomeItem[]>([]);
  const [loading, setLoading] = useState(false);
  // --- END: Local state ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    setData([
      {
        counter: "20/35",
        description: "HOME.DELIVERIES_FOR_TODAY",
        route: "manifests",
      },
      {
        counter: "26",
        description: "HOME.DELIVERY_MANIFEST",
        route: "manifests",
      },
      {
        counter: "3",
        description: "HOME.PICKUPS_FOR_TODAY",
        route: "manifests",
      },
      { counter: "0", description: "HOME.PICKUP_MANIFEST", route: "manifests" },
    ]);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}
