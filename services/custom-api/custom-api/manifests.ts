import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import {
  IOptionalManifestProps,
  IFetchManifestByIdData,
} from "@constants/types/manifests";
export function fetchManifestData({
  driverId,
  createdDate,
}: IOptionalManifestProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/manifest`, {
    params: { createdDate, driverId },
  });
}
export function fetchManifestByIdData({
  id,
}: IOptionalManifestProps): Promise<AxiosResponse<IFetchManifestByIdData>> {
  return axiosClient.get(`shipment/manifest/${id}`);
}
