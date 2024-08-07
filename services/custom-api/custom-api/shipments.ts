import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import {
  IFetchShipmentByIdData,
  IOptionalShipmentProps,
  IOptionalPiecesProps,
  IFetchPiecesByIdData,
  IOptionalCommentsProps,
} from "@constants/types/shipments";
import { API_KEY, BASE_URL } from "@constants/url";

export function fetchShipmentData({
  manifest,
}: IOptionalShipmentProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/`, {
    params: { manifest },
  });
}
export function fetchPiecesData({
  id: shipmentId,
}: IOptionalPiecesProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/piece`, {
    params: { shipmentId },
  });
}

export function fetchShipmentByIdData({
  id,
}: IOptionalShipmentProps): Promise<AxiosResponse<IFetchShipmentByIdData>> {
  return axiosClient.get(`shipment/${id}`);
}
export function fetchPiecesByIdData({
  id,
}: IOptionalPiecesProps): Promise<AxiosResponse<IFetchPiecesByIdData>> {
  return axiosClient.get(`shipment/piece/${id}`);
}

export function fetchCommentsByIdData({
  id,
}: IOptionalCommentsProps): Promise<AxiosResponse<string[]>> {
  return axiosClient.get(`shipment/shipment/comment`, {
    params: { shipmentId: Number(id) },
  });
}
export function addCommentdData({
  comment,
  companyID,
  shipmentID,
  userID,
}: IOptionalCommentsProps): Promise<AxiosResponse<unknown>> {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${BASE_URL}shipment/shipment/comment/post?companyID=${companyID}&userID=${userID}&shipmentID=${shipmentID}&comment=${comment}`,
    headers: {
      ApiKey: API_KEY,
    },
  };

  return axiosClient.request(config);
}