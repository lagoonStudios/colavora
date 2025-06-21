import { differenceInCalendarDays } from "date-fns";
import { useEffect, useCallback, useState } from "react";

import { useStore } from "@stores/zustand";
import { IFetchUserData } from "@constants/types/general";
import { useTranslation } from "react-i18next";
import { GeneralLocalService } from "@/db/repositories/general.repository";
import { ShipmentLocalService } from "@/db/repositories/shipments.repository";
import { ManifestsLocalService } from "@/db/repositories/manifests.repository";

export function useDataFetch(user: IFetchUserData | null) {
  // --- Hooks -----------------------------------------------------------------
  const {
    setModal: setModalMessage,
    setVisible,
    setSyncing,
    setLastSyncDate,
    addManifestIds,
    addShipmentIds,
    addManifestId,
    lastSyncDate,
    isSyncing,
    setMessageErrorModal,
  } = useStore();
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  // --- END: Local state ------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------------
  const fetchDataLocally = useCallback(
    async (user: IFetchUserData) => {
      if (isSyncing == false) {
        try {
          setSyncing(true);
          const values = await GeneralLocalService.resetDatabase(user, {
            setModalMessage,
          });

          setLastSyncDate(new Date().toISOString());

          const manifestIdsFromFetching = values.manifests.map(({ manifest }) =>
            Number(manifest)
          );

          if (manifestIdsFromFetching.length > 0) {
            addManifestIds(
              values.manifests.map(({ manifest }) => Number(manifest))
            );
            const firstManifest = manifestIdsFromFetching.sort(
              (a, b) => a - b
            )?.[0];

            if (firstManifest) {
              addManifestId(String(firstManifest));
              const { shipmentIds } =
                await ShipmentLocalService.getAllShipmentIds({
                  manifestID: String(firstManifest),
                });

              if (shipmentIds?.length > 0) addShipmentIds(shipmentIds);
            }
          }

          setSyncing(false);
          setVisible(false);
        } catch (error) {
          setMessageErrorModal(`Error using Local Data: ${String(error)}`);
          console.error(
            "🚀 ~ file: data.ts:28 ~ fetchDataLocally ~ error:",
            error
          );
          setSyncing(false);
          setVisible(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, setModalMessage, user]
  );
  // --- END: Data and handlers ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (user && lastSyncDate === null) fetchDataLocally(user);
    else if (user && lastSyncDate !== null) {
      const actualDate = new Date();
      const lastDate = new Date(lastSyncDate);
      const difference = differenceInCalendarDays(actualDate, lastDate);
      /* TO DO: si la diferencia de fecha es 0 requerir la local data para meterla en zustand */
      if (difference > 0) fetchDataLocally(user);
      else if (difference === 0 && loading === false) setLoading(true);

      ManifestsLocalService.getAllManifestIds()
        .then(({ manifestIds }) => {
          if (manifestIds.length > 0) addManifestIds(manifestIds);

          const firstManifest = manifestIds.sort((a, b) => a - b)?.[0];

          return firstManifest;
        })
        .then((firstManifest) => {
          if (firstManifest) {
            addManifestId(String(firstManifest));
            ShipmentLocalService.getAllShipmentIds({
              manifestID: String(firstManifest),
            })
              .then(({ shipmentIds }) => {
                if (shipmentIds?.length > 0) addShipmentIds(shipmentIds);
                setLoading(false);
              })
              .catch((e) => {
                setMessageErrorModal(`${e}`);
                console.error(
                  "🚀 ~ file: data.ts:112 ~ voidgetAllManifestIds ~ e:",
                  e
                );
                setLoading(false);
              });
          } else {
            setLoading(false);
          }

          setSyncing(false);
          setVisible(false);
        })
        .catch((e) => {
          setMessageErrorModal(`${e}`);
          console.error(
            "🚀 ~ file: data.ts:117 ~ voidgetAllManifestIds ~ e:",
            e
          );
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, lastSyncDate]);
  // --- END: Side effects -----------------------------------------------------

  return;
}
