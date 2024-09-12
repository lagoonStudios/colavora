import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import {
  IOptionalProps,
  IFetchManifestByIdData,
  IFetchManifestOfflineData,
} from "@constants/types/manifests";
export function fetchManifestData({
  driverId,
  createdDate,
  companyID
}: IOptionalProps): Promise<AxiosResponse<number[]>> {
  const date = createdDate?.split(".")[0]
  return axiosClient.get(`shipment/manifest`, {
    params: { createdDate: date, driverId, companyID },
  });
}
export function fetchManifestByIdData({
  id,
}: IOptionalProps): Promise<AxiosResponse<IFetchManifestByIdData>> {
  return axiosClient.get(`shipment/manifest/${id}`);
}

export function fetchManifestOfflineData({
  driverId,
  createdDate,
  companyID
}: IOptionalProps): Promise<AxiosResponse<IFetchManifestOfflineData[]>> {
  const date = createdDate?.split(".")[0];

  return axiosClient.get(`shipment/shipment/select`, {
    params: { ManifestDate: date, driverId, companyID },
  });
}
