import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import {
  IOptionalProps,
  IFetchManifestByIdData,
} from "@constants/types/manifests";
export function fetchManifestData({
  driverId,
  createdDate,
  companyID
}: IOptionalProps): Promise<AxiosResponse<number[]>> {
  const date = createdDate?.split(".")[0]
  console.log({ date, driverId, companyID });
  return axiosClient.get(`shipment/manifest`, {
    params: { createdDate: date, driverId, companyID },
  });
}
export function fetchManifestByIdData({
  id,
}: IOptionalProps): Promise<AxiosResponse<IFetchManifestByIdData>> {
  return axiosClient.get(`shipment/manifest/${id}`);
}
