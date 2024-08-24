import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import {
  IFetchDriverData,
  IFetchCompanyData,
  IFetchStatusByIdData,
  ICODData,
} from "@constants/types/general";
import { IOptionalPiecesProps } from "@constants/types/shipments";
import { IReasonsByIdData, } from "@constants/types/general";
import { IOptionalProps } from "@constants/types/manifests";

export function fetchDriverData(
  id: string,
): Promise<AxiosResponse<IFetchDriverData>> {
  return axiosClient.get(`common/driver/${id}`);
}
export function fetchStatusData({ companyID }: IOptionalProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`common/status`, { params: { companyID } });
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

export function fetchReasonsData({ companyID }: IOptionalProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`common/reason`, { params: { companyID } });
}
export function fetchReasonsByIdData({
  id,
  language
}: IOptionalPiecesProps): Promise<AxiosResponse<IReasonsByIdData>> {
  return axiosClient.get(`common/reason/${id}`, { params: { language } });
}
export function fetchCODData({ companyID }: IOptionalProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`common/cod`, { params: { companyID } });
}
export function fetchCODByIdData({
  id,
  language
}: IOptionalPiecesProps): Promise<AxiosResponse<ICODData>> {
  return axiosClient.get(`common/cod/${id}`, { params: { language } });
}
