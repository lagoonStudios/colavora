import { useEffect, useState } from "react";
import { ManifestListItemProps } from "@molecules/ManifestListItem/ManifestListItem.types";

export function useManifestsListData() {
  // --- Local state -----------------------------------------------------------
  const [data, setData] = useState<ManifestListItemProps[]>([]);
  const [loading, setLoading] = useState(false);
  // --- END: Local state ------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    setData([
      { code: "123456", date: "2023-01-01", count: 10 },
      { code: "123457", date: "2023-01-02", count: 20 },
      { code: "123458", date: "2023-01-03", count: 30 },
      { code: "123459", date: "2023-01-04", count: 40 },
      { code: "123460", date: "2023-01-05", count: 50 },
      { code: "123461", date: "2023-01-06", count: 60 },
      { code: "123462", date: "2023-01-07", count: 70 },
      { code: "123463", date: "2023-01-08", count: 80 },
      { code: "123464", date: "2023-01-09", count: 90 },
      { code: "123465", date: "2023-01-10", count: 100 },
      { code: "123466", date: "2023-01-11", count: 110 },
      { code: "123467", date: "2023-01-12", count: 120 },
      { code: "123468", date: "2023-01-13", count: 130 },
      { code: "123469", date: "2023-01-14", count: 140 },
      { code: "123470", date: "2023-01-15", count: 150 },
    ]);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  // --- END: Side effects -----------------------------------------------------

  return { data, setData, loading, setLoading };
}
