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
        description: "Deliveries for today",
        route: "manifests",
      },
      {
        counter: "26",
        description: "Delivery manifest",
        route: "manifests",
      },
      {
        counter: "3",
        description: "Pickupt for today",
        route: "manifests",
      },
      { counter: "0", description: "Pickup manifest", route: "manifests" },
    ]);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}
