import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchManifestData,
  fetchManifestByIdData,
} from "@/services/custom-api";
import { queryKeys } from "@constants/Constants";
import {
  IFetchManifestByIdData,
  IOptionalManifestProps,
} from "@constants/types/manifests";

export function useManifestsIdData({
  createdDate,
  driverId,
  optionalKey,
}: IOptionalManifestProps) {
  const manifestsIdData = useQuery({
    queryKey: [optionalKey ?? queryKeys.manifestsIdData],
    queryFn: async () => {
      const { data: rawData } = await fetchManifestData({
        createdDate,
        driverId,
      });

      return rawData ?? [];
    },
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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
