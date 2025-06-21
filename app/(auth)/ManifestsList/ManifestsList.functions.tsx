import { useEffect, useState } from "react";
import { ManifestListItemProps } from "@molecules/ManifestListItem/ManifestListItem.types";
import { useStore } from "@stores/zustand";
import { ManifestsLocalService } from "../../../db/repositories/manifests.repository";

export function useManifestsListData() {
  // --- Local state -----------------------------------------------------------
  const [loading] = useState(false);
  const { isSyncing, setModalErrorModal } = useStore();
  const [data, setData] = useState<ManifestListItemProps[]>([]);
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------

  useEffect(() => {
    const getData = () => {
      ManifestsLocalService.getManifestsList()
        .then(({ value }) => {
          setData(value);
        })
        .catch((error) => {
          setModalErrorModal(`Error getting Manifest List: ${error}`);
          console.error(
            "🚀 ~ file: ManifestsList.functions.tsx:30 ~ getData ~ error:",
            error
          );
        });
    };
    if (isSyncing === false) getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSyncing]);

  // --- END: Data and handlers ------------------------------------------------

  return { data, loading };
}
