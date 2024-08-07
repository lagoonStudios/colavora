import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import {
  IFetchDriverData,
  IFetchCompanyData,
  IFetchStatusByIdData,
  ICODData,
} from "@constants/types/general";
import { IOptionalPiecesProps } from "@constants/types/shipments";
import { IReasonsByIdData } from "@constants/types/general";

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

export function fetchStatusByIdData(
  id?: string,
): Promise<AxiosResponse<IFetchStatusByIdData>> {
  return axiosClient.get(`common/status/${id}`);
}

export function fetchReasonsData(): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`common/reason`);
}
export function fetchReasonsByIdData({
  id,
}: IOptionalPiecesProps): Promise<AxiosResponse<IReasonsByIdData>> {
  return axiosClient.get(`common/reason/${id}`);
}
export function fetchCODData(): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`common/cod`);
}
export function fetchCODByIdData({
  id,
}: IOptionalPiecesProps): Promise<AxiosResponse<ICODData>> {
  return axiosClient.get(`common/cod/${id}`);
}
