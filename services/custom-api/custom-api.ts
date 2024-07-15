import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import { IFetchDriverData, IFetchShipmentData } from "@constants/types";

export function fetchDriverData(
  id: string,
): Promise<AxiosResponse<IFetchDriverData>> {
  return axiosClient.get(`common/driver/${id}`);
}

export function fetchShipmentData(
  id?: string,
): Promise<AxiosResponse<IFetchShipmentData>> {
  return axiosClient.get(`company/${id}`);
}
