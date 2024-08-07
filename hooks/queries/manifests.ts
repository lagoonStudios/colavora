import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchManifestData,
  fetchManifestByIdData,
} from "@/services/custom-api";
import { queryKeys } from "@constants/Constants";
import {
  IFetchManifestByIdData,
  IOptionalManifestProps,
} from "@constants/types";

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

export function useManifestsByIdData(ids: number[]) {
  const manifestsByIdData = useQueries({
    queries: ids?.map((id) => ({
      queryKey: [`${queryKeys.manifestsByIdData}-${id}`],
      queryFn: async () => {
        const { data: rawData } = await fetchManifestByIdData({
          id: String(id),
        });
        return rawData ?? [];
      },
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => {
          const data: IFetchManifestByIdData = result?.data ?? {};
          return data;
        }),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  return { ...manifestsByIdData, data: manifestsByIdData?.data ?? [] };
}
