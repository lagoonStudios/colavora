import { useQuery } from "@tanstack/react-query";
import { fetchManifestData } from "@/services/custom-api";
import { queryKeys } from "@constants/Constants";
import { IOptionalManifestProps } from "@constants/types";

export function useManifestsIdData({
  createdDate,
  driverId,
  status,
  optionalKey,
}: IOptionalManifestProps) {
  const manifestsIdData = useQuery({
    queryKey: [optionalKey ?? queryKeys.manifestsIdData],
    queryFn: async () => {
      const { data: rawData } = await fetchManifestData({
        createdDate,
        driverId,
        status,
      });

      return rawData ?? [];
    },
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: !!driverId,
  });

  return manifestsIdData;
}
