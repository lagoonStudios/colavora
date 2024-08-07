import { useEffect, useMemo, useState } from "react";
import { HomeItem } from "./Home.types";
import {
  useDriverData,
  useManifestsIdData,
  useReasonsIdData,
  useReasonsByIdData,
  useCODIdData,
  useCODByIdData,
} from "@hooks/index";
import { mockDriverId } from "@constants/Constants";
import { useStore } from "@stores/zustand";

export function useHomeData() {
  // --- Local state -----------------------------------------------------------
  const createdDate = new Date("2024-05-20T00:01:00").toISOString();

  const [data, setData] = useState<HomeItem[]>([]);
  const [driverId, setDriverId] = useState<number>();
  const [loading, setLoading] = useState(true);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { data: driverData } = useDriverData(mockDriverId);
  const { data: manifestIdData, isSuccess } = useManifestsIdData({
    createdDate,
    driverId: String(driverId ?? ""),
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
    if (driverData) setDriverId(driverData?.userID);
  }, [driverData]);

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
  }, [manifestIdData, totalManifests]);

  useEffect(() => {
    if (isSuccess) setLoading(false);
  }, [isSuccess]);

  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}

export function useReasonsData() {
  // --- Hooks -----------------------------------------------------------------
  const { addReasonIds, reasonIds, addReason } = useStore();

  const { data: reasonsIds } = useReasonsIdData();
  const { data: reasonsResponse, pending } = useReasonsByIdData(reasonIds);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (reasonsIds) addReasonIds(reasonsIds);
  }, [addReasonIds, reasonsIds]);

  useEffect(() => {
    if (pending === false)
      reasonsResponse?.map((reason) => {
        if (reason) addReason(reason);
      });
  }, [addReason, pending, reasonsResponse]);
  // --- END: Side effects -----------------------------------------------------
}

export function useCODData() {
  // --- Hooks -----------------------------------------------------------------
  const { addCODIds, CODIds, addCOD } = useStore();

  const { data: CODIdsData } = useCODIdData();
  const { data: CODs, pending } = useCODByIdData(CODIds);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (CODIdsData) addCODIds(CODIdsData);
  }, [addCODIds, CODIdsData]);

  useEffect(() => {
    if (pending === false)
      CODs?.map((COD) => {
        if (COD) addCOD(COD);
      });
  }, [CODs, addCOD, pending]);
  // --- END: Side effects -----------------------------------------------------
}
