import { useEffect, useMemo, useState } from "react";
import i18next from "i18next";
import { HomeItem } from "./Home.types";
import {
  useDriverData,
  useManifestsIdData,
  useReasonsIdData,
  useReasonsByIdData,
  useCODIdData,
  useCODByIdData,
} from "@hooks/index";
import { mockCompanyId, mockDriverId } from "@constants/Constants";
import { useStore } from "@stores/zustand";
import { useShipmentsIdData } from "@hooks/queries";

export function useHomeData() {
  // --- Local state -----------------------------------------------------------
  const createdDate = new Date("2024-05-20T00:01:00").toISOString();

  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState<number>();
  const [todayManifest, setTodayManifest] = useState<number>();
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { addShipmentIds, shipmentIds: localShipmentIds } = useStore();
  const { data: driverData } = useDriverData(mockDriverId);
  const { data: manifestIdData, isSuccess } = useManifestsIdData({
    createdDate,
    driverId: String(driverId ?? ""),
  });
  const { data: shipmentIds, isSuccess: isSuccessShipmentIds } =
    useShipmentsIdData({
      manifest: todayManifest ? String(todayManifest) : undefined,
    });
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (shipmentIds?.length && shipmentIds?.length !== 0)
      addShipmentIds(shipmentIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentIds]);

  useEffect(() => {
    if (manifestIdData?.[0]) setTodayManifest(manifestIdData?.[0]);
  }, [manifestIdData]);

  useEffect(() => {
    if (driverData) setDriverId(driverData?.userID);
  }, [driverData]);

  useEffect(() => {
    if (isSuccess && isSuccessShipmentIds) setLoading(false);
  }, [isSuccess, isSuccessShipmentIds]);

  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const totalManifests = useMemo(
    () => manifestIdData?.length ?? 0,
    [manifestIdData],
  );

  const totalOrdersForToday = useMemo(
    () => localShipmentIds?.length ?? 0,
    [localShipmentIds],
  );
  
  const data: HomeItem[] = useMemo(
    () => [
      {
        counter: `${totalOrdersForToday}`,
        description: "HOME.DELIVERIES_FOR_TODAY",
        route: "ordersForToday",
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
    ],
    [manifestIdData, totalManifests, totalOrdersForToday]
  );
  // --- END: Data and handlers ------------------------------------------------

  return { data, loading, setLoading };
}

export function useReasonsData() {
  // --- Hooks -----------------------------------------------------------------
  const { addReasonIds, reasonIds, addReason } = useStore();

  const { data: reasonsIds } = useReasonsIdData(String(mockCompanyId));
  const { data: reasonsResponse, pending } = useReasonsByIdData(reasonIds, i18next.language);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (reasonsIds) addReasonIds(reasonsIds);
  }, [reasonsIds]);

  useEffect(() => {
    if (pending === false)
      reasonsResponse?.map((reason) => {
        if (reason) addReason(reason);
      });
  }, [pending, reasonsResponse]);
  // --- END: Side effects -----------------------------------------------------
}

export function useCODData() {
  // --- Hooks -----------------------------------------------------------------
  const { addCODIds, CODIds, addCOD } = useStore();

  const { data: CODIdsData } = useCODIdData(String(mockCompanyId));
  const { data: CODs, pending } = useCODByIdData(CODIds, i18next.language);
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (CODIdsData) addCODIds(CODIdsData);
  }, [CODIdsData]);

  useEffect(() => {
    if (pending === false)
      CODs?.map((COD) => {
        if (COD) addCOD(COD);
      });
  }, [CODs, pending]);
  // --- END: Side effects -----------------------------------------------------
}
