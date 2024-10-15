import { useStore } from "@stores/zustand";
import { useEffect } from "react";
import { getAllShipmentIds, resetDatabase } from "./SQLite";
import { useTranslation } from "react-i18next";
import Toast from "react-native-root-toast";
import { useIsConnected } from "react-native-offline";

/** Gets the sync period (in minutes) from the store and sets up a timer to sync the data every syncPeriod minutes */
export const useSyncDataByPeriod = () => {
  // --- Hooks -----------------------------------------------------------------
  const {
    syncPeriod,
    setSyncing,
    isSyncing,
    user,
    setModal,
    setLastSyncDate,
    addManifestIds,
    addManifestId,
    addShipmentIds,
    setVisible,
  } = useStore();
  const { t } = useTranslation();
  const isConnected = useIsConnected();

  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    const id = setInterval(
      () => {
        if (!isConnected) {
          Toast.show(t("NETWORK_ERROR.TITLE"));
          return;
        }
        if (user && !isSyncing) {
          setSyncing(true);
          resetDatabase(user, { t, setModalMessage: setModal })
            .then((values) => {
              setLastSyncDate(new Date().toISOString());
              const manifestIdsFromFetching = values.manifests.map(
                ({ manifest }) => Number(manifest)
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
                  getAllShipmentIds({ manifestID: String(firstManifest) }).then(
                    (shipmentsIdsLocal) => {
                      const shipmentIds = shipmentsIdsLocal?.map(
                        ({ shipmentID }) => shipmentID
                      );

                      if (shipmentIds?.length > 0) addShipmentIds(shipmentIds);
                    }
                  );
                }
              }

              setSyncing(false);
              setVisible(false);
              Toast.show(t("TOAST.SYNC_SUCCESS"));
            })
            .catch((error) => {
              console.error(
                "🚀 ~ file: SyncLocalData.tsx:63 ~ useSyncDataByPeriod ~ error:",
                error
              );
              setSyncing(false);
              setVisible(false);
              Toast.show(t("TOAST.SYNC_FAIL"));
            });
          setSyncing(false);
        }
      },
      syncPeriod * 60 * 1000
    );

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncPeriod]);
  // --- END: Side effects -----------------------------------------------------
};
