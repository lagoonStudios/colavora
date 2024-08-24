import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import {
  IOptionalProps,
  IFetchManifestByIdData,
} from "@constants/types/manifests";
export function fetchManifestData({
  driverId,
  createdDate,
}: IOptionalProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/manifest`, {
    params: { createdDate, driverId },
  });
}
export function fetchManifestByIdData({
  id,
}: IOptionalProps): Promise<AxiosResponse<IFetchManifestByIdData>> {
  return axiosClient.get(`shipment/manifest/${id}`);
}
