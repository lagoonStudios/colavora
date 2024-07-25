import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import { IFetchDriverData, IFetchCompanyData } from "@constants/types";

export function fetchDriverData(
  id: string,
): Promise<AxiosResponse<IFetchDriverData>> {
  return axiosClient.get(`common/driver/${id}`);
}

export function fetchCompanyData(
  id?: string,
): Promise<AxiosResponse<IFetchCompanyData>> {
  return axiosClient.get(`company/${id}`);
}
