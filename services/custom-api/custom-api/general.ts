import axios, { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IFetchUserData,
  IFetchCompanyData,
  IFetchStatusByIdData,
  ICODData,
} from "@constants/types/general";
import { IOptionalPiecesProps } from "@constants/types/shipments";
import { IReasonsByIdData } from "@constants/types/general";
import { IOptionalProps } from "@constants/types/manifests";
import { AUTH0_DOMAIN } from "@constants/url";

export async function fetchAuth0UserInfo() {
  const token = await AsyncStorage.getItem("auth0:token");

  if (token) {
    const axiosClientAuth0 = axios.create({
      baseURL: AUTH0_DOMAIN,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return axiosClientAuth0.get("/userinfo");
  }
}

export function fetchDriverDataByAuth0({
  id: auth0,
}: IOptionalProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`common/driver`, { params: { auth0 } });
}
export function fetchUserData(
  id: string,
): Promise<AxiosResponse<IFetchUserData>> {
  return axiosClient.get(`company/user/${id}`);
}
export function fetchStatusData({
  companyID,
}: IOptionalProps): Promise<AxiosResponse<number[]>> {
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

export function fetchReasonsData({
  companyID,
}: IOptionalProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`common/reason`, { params: { companyID } });
}
export function fetchReasonsByIdData({
  id,
  language,
}: IOptionalPiecesProps): Promise<AxiosResponse<IReasonsByIdData>> {
  return axiosClient.get(`common/reason/${id}`, { params: { language } });
}
export function fetchCODData({
  companyID,
}: IOptionalProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`common/cod`, { params: { companyID } });
}
export function fetchCODByIdData({
  id,
  language,
}: IOptionalPiecesProps): Promise<AxiosResponse<ICODData>> {
  return axiosClient.get(`common/cod/${id}`, { params: { language } });
}
