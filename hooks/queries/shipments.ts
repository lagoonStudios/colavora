import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchShipmentData,
  fetchShipmentByIdData,
} from "@/services/custom-api";
import { queryKeys } from "@constants/Constants";
import {
  IFetchShipmentByIdData,
  IOptionalManifestProps,
} from "@constants/types";

export function useShipmentsIdData({ manifest }: IOptionalManifestProps) {
  const shipmentsIdData = useQuery({
    queryKey: [queryKeys.shipmentsIdData],
    queryFn: async () => {
      const { data: rawData } = await fetchShipmentData({
        manifest,
      });

      return rawData ?? [];
    },
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return shipmentsIdData;
}

export function useShipmentsByIdData(ids: number[]) {
  const shipmentsByIdData = useQueries({
    queries: ids?.map((id) => ({
      queryKey: [`${queryKeys.shipmentsByIdData}-${id}`],
      queryFn: async () => {
        const { data: rawData } = await fetchShipmentByIdData({
          id: String(id),
        });
        return rawData ?? [];
      },
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => {
          const data: IFetchShipmentByIdData = result?.data ?? {};
          return data;
        }),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  return { ...shipmentsByIdData, data: shipmentsByIdData?.data ?? [] };
}
