import { useEffect, useMemo, useState } from "react";
import { ManifestListItemProps } from "@molecules/ManifestListItem/ManifestListItem.types";

export function useManifestsListData(manifestIds: string[]) {
  // --- Local state -----------------------------------------------------------
  const [loading, setLoading] = useState(true);
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const data: ManifestListItemProps[] = useMemo(() => {
    if (manifestIds)
      return manifestIds?.map((code) => {
        const manifest: ManifestListItemProps = { code };
        return manifest;
      });
    return [];
  }, [manifestIds]);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (data.length !== 0) setLoading(false);
  }, [data]);
  // --- END: Side effects -----------------------------------------------------

  return { data, loading };
}
