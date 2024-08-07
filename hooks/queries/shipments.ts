import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchShipmentData,
  fetchShipmentByIdData,
  fetchPiecesData,
  fetchPiecesByIdData,
} from "@/services/custom-api";
import { queryKeys } from "@constants/Constants";
import {
  IFetchPiecesByIdData,
  IFetchShipmentByIdData,
  IOptionalManifestProps,
} from "@constants/types";

export function useShipmentsIdData({ manifest }: IOptionalManifestProps) {
  const queryKey = [`${queryKeys.shipmentsIdData}-${manifest}`];

  const shipmentsIdData = useQuery({
    queryKey,
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

export function usePiecesIdData({ id }: IOptionalManifestProps) {
  const queryKey = [`${queryKeys.piecesIdData}-${id}`];

  const piecesIdData = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: rawData } = await fetchPiecesData({
        id: id,
      });

      return rawData ?? [];
    },
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return piecesIdData;
}

export function usePiecesByIdData(ids: number[]) {
  const piecesByIdData = useQueries({
    queries: ids?.map((id) => ({
      queryKey: [`${queryKeys.piecesByIdData}-${id}`],
      queryFn: async () => {
        const { data: rawData } = await fetchPiecesByIdData({
          id: String(id),
        });
        return rawData ?? [];
      },
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => {
          const data: IFetchPiecesByIdData = result?.data ?? {};
          return data;
        }),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  return { ...piecesByIdData, data: piecesByIdData?.data ?? [] };
}
