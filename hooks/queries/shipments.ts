import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Toast from "react-native-root-toast";
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
import { IOptionalProps } from "@constants/types/manifests";

export function useShipmentsIdData({ manifest }: IOptionalProps) {
  const queryKey = [`${queryKeys.shipmentsIdData}-${manifest}`];

  const shipmentsIdData = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: rawData } = await fetchShipmentData({
        manifest,
      });

      return rawData ?? [];
    },
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    enabled: !!manifest,
  });

  return shipmentsIdData;
}

export function useShipmentsByIdData(ids: number[]) {
  if (ids == null) {
    console.error("🚀 ~ file: shipments.ts:52 ~ useShipmentsByIdData ~ ids:", ids);
    return;
  }
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

export function usePiecesIdData({ id }: IOptionalProps) {
  const queryKey = [`${queryKeys.piecesIdData}-${id}`];

  const piecesIdData = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: rawData } = await fetchPiecesData({
        id: id,
      });

      return rawData ?? [];
    },
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
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

export function useCommentsIdData({ id }: IOptionalProps) {
  const queryKey = [`${queryKeys.commnetsByIdData}-${id}`];

  const piecesIdData = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: rawData } = await fetchCommentsByIdData({
        id,
      });

      return rawData ?? [];
    },
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
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
      photoImage
    }: IOptionalExceptionProps) => {
      return await orderException({
        companyID,
        comment,
        userID,
        shipmentID,
        reasonID,
        photoImage
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
  const { t } = useTranslation();

  const request = useMutation({
    mutationFn: async ({
      companyID,
      userID,
      shipmentID,
      barcode,
      podName,
      photoImage,
      signatureImage,
      comment,
    }: ICompleteOrder) => {
      const barcodes = barcode
        ?.replaceAll(",", "")
        ?.split(" ")
        .filter((e) => e !== "" && e !== " ");

        console.log({ barcode, barcodes });

      if (barcodes && barcodes?.length !== 0) {
        const results = [];
        for (const barcode of barcodes) {
          try {
            const result = await completeOrder({
              companyID,
              userID,
              shipmentID,
              barcode,
              podName,
              photoImage,
              signatureImage,
              comment,
            });
            results.push(result);
          } catch (error) {
            console.error("🚀 ~ useCompleteOrder ~ e:", error)
          }
        }
        return results;
      } else Toast.show(t("TOAST.ERROR_BARCODES"));
    },
    onError: (e) => console.error("🚀 ~ useCompleteOrder ~ e:", e),
  });

  return request;
}
