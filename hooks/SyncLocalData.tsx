import { useStore } from "@stores/zustand";
import { useEffect } from "react";

/** Gets the sync period (in minutes) from the store and sets up a timer to sync the data every syncPeriod minutes */
export const useSyncDataByPeriod = () => {
  // --- Hooks -----------------------------------------------------------------
  const { syncPeriod, setSyncing, user } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    setSyncing(true);
    const id = setInterval(
      () => {
        setSyncing(false);
        console.info("Implement sync logic here", new Date().getSeconds());
      },
      syncPeriod * 60 * 1000
    );

    return () => clearInterval(id);
  }, [syncPeriod]);
  // --- END: Side effects -----------------------------------------------------
};
