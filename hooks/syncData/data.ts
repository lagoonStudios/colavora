import { differenceInCalendarDays } from "date-fns";
import { useEffect, useCallback, useState } from "react";

import { useStore } from "@stores/zustand";
import { IFetchUserData } from "@constants/types/general";
import { useTranslation } from "react-i18next";
import {
  getAllManifestIds,
  getAllShipmentIds,
  resetDatabase,
} from "@hooks/SQLite";

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
  } = useStore();
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  // --- END: Local state ------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------------
  const fetchDataLocally = useCallback(
    (user: IFetchUserData) => {
      if (isSyncing == false) {
        setSyncing(true);
        resetDatabase(user, {
          t,
          setModalMessage,
        })
          .then((values) => {
            setLastSyncDate(new Date().toISOString());
            const manifestIdsFromFetching = values.manifests.map(
              ({ manifest }) => Number(manifest),
            );

            if (manifestIdsFromFetching.length > 0) {
              addManifestIds(
                values.manifests.map(({ manifest }) => Number(manifest)),
              );
              const firstManifest = manifestIdsFromFetching.sort(
                (a, b) => a - b,
              )?.[0];

              if (firstManifest) {
                addManifestId(String(firstManifest));
                void getAllShipmentIds({
                  manifestID: String(firstManifest),
                }).then((shipmentsIdsLocal) => {
                  const shipmentIds = shipmentsIdsLocal?.map(
                    ({ shipmentID }) => shipmentID,
                  );

                  if (shipmentIds?.length > 0) addShipmentIds(shipmentIds);
                });
              }
            }

            setSyncing(false);
            setVisible(false);
          })
          .catch((error) => {
            console.error(
              "🚀 ~ file: data.ts:28 ~ fetchDataLocally ~ error:",
              error,
            );
            setSyncing(false);
            setVisible(false);
          });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, setModalMessage, user],
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
      void getAllManifestIds()
        .then((manifestIds) => {
          if (manifestIds.length > 0) addManifestIds(manifestIds);

          const firstManifest = manifestIds.sort((a, b) => a - b)?.[0];

          if (firstManifest) {
            addManifestId(String(firstManifest));
            void getAllShipmentIds({ manifestID: String(firstManifest) })
              .then((shipmentsIdsLocal) => {
                const shipmentIds = shipmentsIdsLocal?.map(
                  ({ shipmentID }) => shipmentID,
                );

                if (shipmentIds?.length > 0) addShipmentIds(shipmentIds);
                setLoading(false);
              })
              .catch((e) => {
                console.error(
                  "🚀 ~ file: data.ts:112 ~ voidgetAllManifestIds ~ e:",
                  e,
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
          console.error(
            "🚀 ~ file: data.ts:117 ~ voidgetAllManifestIds ~ e:",
            e,
          );
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, lastSyncDate]);
  // --- END: Side effects -----------------------------------------------------

  return;
}
