import { useState, useEffect } from "react";

import { useStore } from "@stores/zustand";
import { useManifestsIdData } from "@hooks/queries";
import { IFetchManifestByIdData } from "@constants/types/manifests";
import { insertMultipleManifests } from "@hooks/SQLite/queries/manifests.local.queries";

export function useManifestFetch() {
  // --- Local state -----------------------------------------------------------
  const createdDate = new Date("2024-08-20T00:01:00").toISOString();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { user, addManifestIds, manifestIds } = useStore();
  const { data: manifestIdData, isSuccess } = useManifestsIdData({
    createdDate,
    driverId: String(user?.driverID ?? ""),
    companyID: user?.companyID
  });
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------  
  useEffect(() => {
    if (manifestIdData && user) {
      addManifestIds(manifestIdData)
      const manifestsForInsert: IFetchManifestByIdData[] = manifestIdData.map(
        (manifest) => ({
          manifest: String(manifest),
          companyID: user.companyID,
          driverID: user.driverID,
          createdDate,
        })
      );

      insertMultipleManifests(manifestsForInsert);
    }
  }, [manifestIdData, user])


  useEffect(() => {
    if (isSuccess && manifestIds?.length !== 0) setLoading(false);
  }, [isSuccess, manifestIds]);

  useEffect(() => {
    if (loading === false) setSuccess(true)
  }, [loading])
  // --- END: Side effects -----------------------------------------------------

  return { success, loading };
}