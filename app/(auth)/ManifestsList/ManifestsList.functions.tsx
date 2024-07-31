import { useEffect, useState } from "react";
import { ManifestListItemProps } from "@molecules/ManifestListItem/ManifestListItem.types";
import { useManifestsByIdData } from "@hooks/queries";

export function useManifestsListData(manifestIds: number[]) {
  // --- Hooks -----------------------------------------------------------------
  const { data: dataManifests, pending } = useManifestsByIdData(
    manifestIds?.slice(0, 20),
  );
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [data, setData] = useState<ManifestListItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  // --- END: Local state ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (pending === false && dataManifests) {
      setData(
        dataManifests?.map(({ manifest, createdDate }) => {
          const code = String(manifest);
          const rawDate = new Date(createdDate ?? "");
          const date = `${rawDate.getFullYear()}-${rawDate.getMonth() + 1}-${rawDate.getDate()}`;

          return { code, date };
        }),
      );
    }
  }, [pending, dataManifests]);

  useEffect(() => {
    if (data.length !== 0) setLoading(false);
  }, [data]);

  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}
