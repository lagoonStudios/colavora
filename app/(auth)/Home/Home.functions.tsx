import { useEffect, useMemo, useState } from "react";
import { HomeItem } from "./Home.types";
import { useDriverData, useManifestsIdData } from "@hooks/index";

export function useHomeData() {
  // --- Local state -----------------------------------------------------------
  const createdDate = new Date("2024-05-20T00:01:00").toLocaleDateString();
  const statusForManifests = "'Our for Delivery','Assigned','Created'";

  const [data, setData] = useState<HomeItem[]>([]);
  const [loading, setLoading] = useState(true);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { data: driverData } = useDriverData("2");
  const { data: manifestIdData, isSuccess } = useManifestsIdData({
    createdDate,
    driverId: driverData?.userID,
    status: statusForManifests,
  });
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const totalManifests = useMemo(
    () => manifestIdData?.length ?? 0,
    [manifestIdData],
  );
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    setData([
      {
        counter: `0/${totalManifests}`,
        description: "HOME.DELIVERIES_FOR_TODAY",
        route: "manifests",
        isDisabled: false,
        data: manifestIdData,
      },
      {
        counter: `${totalManifests}`,
        description: "HOME.DELIVERY_MANIFEST",
        route: "manifests",
        isDisabled: false,
        data: manifestIdData,
      },
      {
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
      },
    ]);
  }, [totalManifests]);

  useEffect(() => {
    if (isSuccess) setLoading(false);
  }, [isSuccess]);

  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}
