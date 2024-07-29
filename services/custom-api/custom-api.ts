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
} from "@constants/types";

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
    params: { createdDate, driverId: String(driverId) },
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
