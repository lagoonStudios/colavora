/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchShipmentData,
  fetchShipmentByIdData,
  fetchPiecesData,
  fetchPiecesByIdData,
  fetchCommentsByIdData,
  addCommentdData,
  orderException,
  sendCOD,
  completeOrder,
} from "@/services/custom-api";
import { queryKeys } from "@constants/Constants";
import {
  ICompleteOrder,
  IFetchPiecesByIdData,
  IFetchShipmentByIdData,
  IOptionalCommentsProps,
  IOptionalExceptionProps,
  ISendCOD,
} from "@constants/types/shipments";
import { IOptionalManifestProps } from "@constants/types/manifests";

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
    enabled: !!manifest,
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

export function useCommentsIdData({ id }: IOptionalManifestProps) {
  const queryKey = [`${queryKeys.commnetsByIdData}-${id}`];

  const piecesIdData = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: rawData } = await fetchCommentsByIdData({
        id,
      });

      return rawData ?? [];
    },
    retry: 3,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return piecesIdData;
}

export function useAddComment() {
  const request = useMutation({
    mutationFn: async ({
      companyID,
      comment,
      userID,
      shipmentID,
    }: IOptionalCommentsProps) => {
      return await addCommentdData({
        companyID,
        comment,
        userID,
        shipmentID,
      });
    },
    onError: (e) => console.error("🚀 ~ useAddComment ~ e:", e),
  });

  return request;
}

export function useOrderException() {
  const request = useMutation({
    mutationFn: async ({
      companyID,
      comment,
      userID,
      shipmentID,
      reasonID,
    }: IOptionalExceptionProps) => {
      return await orderException({
        companyID,
        comment,
        userID,
        shipmentID,
        reasonID,
      });
    },
    onError: (e) => console.error("🚀 ~ useOrderException ~ e:", e),
  });

  return request;
}

export function useSendCODs() {
  const request = useMutation({
    mutationFn: async (CODs: ISendCOD[]) => {
      const results = await Promise.all(
        CODs.map(async (cod) => {
          return await sendCOD({
            ...cod,
          });
        }),
      );
      return results;
    },
    onError: (e) => console.error("🚀 ~ useSendCODs ~ e:", e),
  });

  return request;
}

export function useCompleteOrder() {
  const request = useMutation({
    mutationFn: async ({
      companyID,
      userID,
      shipmentID,
      barcode,
      podName,
      photoImage,
      signatureImage,
    }: ICompleteOrder) => {
      const barcodes = barcode
        ?.replaceAll(",", "")
        ?.split(" ")
        .filter((e) => e !== "" && e !== " ");

      if (barcodes) {
        const results = [];
        for (const barcode of barcodes) {
          const result = await completeOrder({
            companyID,
            userID,
            shipmentID,
            barcode,
            podName,
            photoImage,
            signatureImage,
          });
          results.push(result);
        }
        return results;
      }
    },
    onError: (e) => console.error("🚀 ~ useCompleteOrder ~ e:", e),
  });

  return request;
}
