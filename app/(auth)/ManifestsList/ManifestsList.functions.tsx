import { useMemo, useState } from "react";
import { ManifestListItemProps } from "@molecules/ManifestListItem/ManifestListItem.types";

export function useManifestsListData(manifestIds: number[]) {
  // --- Local state -----------------------------------------------------------
  const [loading] = useState(false);
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const data: ManifestListItemProps[] = useMemo(() => {
    if (manifestIds)
      return manifestIds?.map((code) => {
        const manifest: ManifestListItemProps = { code: String(code) };
        return manifest;
      });
    return [];
  }, [manifestIds]);
  // --- END: Data and handlers ------------------------------------------------

  return { data, loading };
}
