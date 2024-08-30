import { useState, useEffect } from "react";

import { useStore } from "@stores/zustand";
import { useManifestsIdData } from "@hooks/queries";
import { IFetchManifestByIdData } from "@constants/types/manifests";
import { insertMultipleManifests } from "@hooks/SQLite/queries/manifests.local.queries";

export function useManifestFetch() {
  // --- Local state -----------------------------------------------------------
  const createdDate = new Date("2024-05-20T00:01:00").toISOString();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { driver, addManifestIds, manifestIds } = useStore();
  const { data: manifestIdData, isSuccess } = useManifestsIdData({
    createdDate,
    driverId: String(driver?.driverID ?? ""),
  });
  // --- END: Hooks ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------  
  useEffect(() => {
    if(manifestIdData && driver) addManifestIds(manifestIdData);    
  }, [manifestIdData, driver])

  useEffect(() => {
    if(manifestIdData && driver){
      const manifestsForInsert: IFetchManifestByIdData[] = manifestIdData.map(
        (manifest) => ({
          manifest: String(manifest),
          companyID: driver.companyID,
          driverID: driver.driverID,
          createdDate,
        })
      );

      insertMultipleManifests(manifestsForInsert);
    }
  }, [manifestIdData, driver])

  useEffect(() => {
    if (isSuccess && manifestIds?.length !== 0) setLoading(false);
  }, [isSuccess]);

  useEffect(() => {
    if(loading === false) setSuccess(true)
  }, [loading])
  // --- END: Side effects -----------------------------------------------------

  return { success, loading };
}