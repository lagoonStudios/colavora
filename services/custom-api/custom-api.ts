import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import {
  IFetchDriverData,
  IFetchCompanyData,
  IOptionalShipmentProps,
  IOptionalManifestProps,
  IFetchShipmentByIdData,
  IFetchManifestByIdData,
  IOptionalPiecesProps,
  IFetchPiecesByIdData,
  IFetchStatusByIdData,
  IOptionalCommentsProps,
} from "@constants/types";
import { API_KEY } from "@constants/url";

export function fetchDriverData(
  id: string,
): Promise<AxiosResponse<IFetchDriverData>> {
  return axiosClient.get(`common/driver/${id}`);
}
export function fetchStatusData(): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`common/status`);
}

export function fetchCompanyData(
  id?: string,
): Promise<AxiosResponse<IFetchCompanyData>> {
  return axiosClient.get(`company/${id}`);
}
export function fetchShipmentData({
  manifest,
}: IOptionalShipmnetProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/`, {
    params: { manifest },
  });
}
export function fetchManifestData({
  driverId,
  createdDate,
}: IOptionalManifestProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/manifest`, {
    params: { createdDate, driverId },
  });
}
export function fetchPiecesData({
  id: shipmentId,
}: IOptionalPiecesProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/piece`, {
    params: { shipmentId },
  });
}

export function fetchStatusByIdData(
  id?: string,
): Promise<AxiosResponse<IFetchStatusByIdData>> {
  return axiosClient.get(`common/status/${id}`);
}
export function fetchShipmentByIdData({
  id,
}: IOptionalShipmentProps): Promise<AxiosResponse<IFetchShipmentByIdData>> {
  return axiosClient.get(`shipment/${id}`);
}
export function fetchManifestByIdData({
  id,
}: IOptionalManifestProps): Promise<AxiosResponse<IFetchManifestByIdData>> {
  return axiosClient.get(`shipment/manifest/${id}`);
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
    url: `https://order.advancelogisticspr.com:8085/api/shipment/shipment/comment/post?companyID=${companyID}&userID=${userID}&shipmentID=${shipmentID}&comment=${comment}`,
    headers: {
      ApiKey: API_KEY,
    },
  };

  return axiosClient.request(config);
}
