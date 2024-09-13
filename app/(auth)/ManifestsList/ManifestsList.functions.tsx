import { useEffect, useState } from "react";
import { ManifestListItemProps } from "@molecules/ManifestListItem/ManifestListItem.types";
import { useStore } from "@stores/zustand";
import { getManifestsList } from "@hooks/SQLite";

export function useManifestsListData() {
  // --- Local state -----------------------------------------------------------
  const [loading] = useState(false);
  const { isSyncing } = useStore();
  const [data, setData] = useState<ManifestListItemProps[]>([]);
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------

  useEffect(() => {
    const getData = () => {
      getManifestsList()
        .then((values: ManifestListItemProps[]) => {
          setData(values);
        })
        .catch((error) => {
          console.error(
            "🚀 ~ file: ManifestsList.functions.tsx:30 ~ getData ~ error:",
            error
          );
        });
    };
    if (isSyncing === false) getData();
  }, [isSyncing]);

  // --- END: Data and handlers ------------------------------------------------

  return { data, loading };
}
