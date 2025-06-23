import { useStore } from "@stores/zustand";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Toast from "react-native-root-toast";
import { useIsConnected } from "react-native-offline";
import { ShipmentLocalService } from "../db/repositories/shipments.repository";
import { GeneralLocalService } from "@/db/repositories/general.repository";

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
    setModalErrorModal,
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
          GeneralLocalService.resetDatabase(user, {
            t,
            setModalMessage: setModal,
          })
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
                  addManifestId(Number(firstManifest));
                  ShipmentLocalService.getAllShipmentIds({
                    manifestID: Number(firstManifest),
                  }).then((shipmentsIdsLocal) => {
                    const shipmentIds = shipmentsIdsLocal?.shipmentIds;

                    if (shipmentIds?.length > 0) addShipmentIds(shipmentIds);
                  });
                }
              }

              setSyncing(false);
              setVisible(false);
              Toast.show(t("TOAST.SYNC_SUCCESS"));
            })
            .catch((error) => {
              setModalErrorModal(`Error Getting Data: ${error}`);
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
