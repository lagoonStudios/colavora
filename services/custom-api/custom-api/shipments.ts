import { AxiosResponse } from "axios";
import { axiosClient } from "@config/axios";
import {
  IFetchShipmentByIdData,
  IOptionalShipmentProps,
  IOptionalPiecesProps,
  IFetchPiecesByIdData,
  IOptionalCommentsProps,
  IOptionalExceptionProps,
  ISendCOD,
  ICompleteOrder,
} from "@constants/types/shipments";
import { API_KEY, BASE_URL } from "@constants/url";

export function fetchShipmentData({
  manifest,
}: IOptionalShipmentProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/`, {
    params: { manifest },
  });
}
export function fetchPiecesData({
  id: shipmentId,
}: IOptionalPiecesProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/piece`, {
    params: { shipmentId },
  });
}

export function fetchShipmentByIdData({
  id,
}: IOptionalShipmentProps): Promise<AxiosResponse<IFetchShipmentByIdData>> {
  return axiosClient.get(`shipment/${id}`);
}
export function fetchPiecesByIdData({
  id,
}: IOptionalPiecesProps): Promise<AxiosResponse<IFetchPiecesByIdData>> {
  return axiosClient.get(`shipment/piece/${id}`);
}

export function fetchCommentsByIdData({
  id,
}: IOptionalCommentsProps): Promise<AxiosResponse<string[]>> {
  return axiosClient.get(`shipment/shipment/comment`, {
    params: { shipmentId: Number(id) },
  });
}
export function addCommentdData({
  comment,
  companyID,
  shipmentID,
  userID,
}: IOptionalCommentsProps): Promise<AxiosResponse<unknown>> {
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${BASE_URL}shipment/shipment/comment/post?companyID=${companyID}&userID=${userID}&shipmentID=${shipmentID}&comment=${comment}`,
    headers: {
      ApiKey: API_KEY,
    },
  };

  return axiosClient.request(config);
}

export function orderException({
  comment,
  companyID,
  shipmentID,
  userID,
  reasonID,
}: IOptionalExceptionProps): Promise<AxiosResponse<unknown>> {
  const url = `${BASE_URL}shipment/event/exception/post?companyID=${companyID}&userID=${userID}&shipmentID=${shipmentID}&comment=${comment}&reasonID=${reasonID}`;
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      ApiKey: API_KEY,
    },
  };

  return axiosClient.request(config);
}

export function sendCOD({
  companyID,
  shipmentID,
  userID,
  codAmount,
  codCheck,
  codTypeID,
}: ISendCOD): Promise<AxiosResponse<unknown>> {
  const url = `${BASE_URL}shipment/event/cod/post?companyID=${companyID}&userID=${userID}&shipmentID=${shipmentID}&codAmount=${codAmount}&codTypeID=${codTypeID}${codCheck && `&codCheck=${codCheck}`}`;

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      ApiKey: API_KEY,
    },
  };

  return axiosClient.request(config);
}

export function completeOrder({
  companyID,
  shipmentID,
  userID,
  barcode,
  photoImage,
  signatureImage,
  podName,
}: ICompleteOrder): Promise<AxiosResponse<unknown>> {
  const url = `${BASE_URL}shipment/event/dispatch/post?companyID=${companyID}&userID=${userID}&shipmentID=${shipmentID}&barcode=${barcode}${photoImage ? `&photoImage=${photoImage}` : ""}&signatureImage=${signatureImage}&podName=${podName}`;

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      ApiKey: API_KEY,
    },
  };

  return axiosClient.request(config);
}
