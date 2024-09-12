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
import { BASE_URL } from "@constants/url";

export function fetchShipmentData({
  manifest,
  companyID,
  driverId
}: IOptionalShipmentProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/`, {
    params: { manifest, companyID, driverId },
  });
}
export function fetchPiecesData({
  id: shipmentId,
  companyID
}: IOptionalPiecesProps): Promise<AxiosResponse<number[]>> {
  return axiosClient.get(`shipment/piece`, {
    params: { shipmentId, companyID },
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
  id
}: { id: number }): Promise<AxiosResponse<string[]>> {
  return axiosClient.get(`shipment/shipment/comment`, {
    params: { shipmentId: Number(id) },
  });
}
export function addCommentData({
  comment,
  companyID,
  shipmentID,
  userID,
}: IOptionalCommentsProps): Promise<AxiosResponse<unknown>> {
  const data = new FormData();
  data.append('companyID', String(companyID));
  data.append('userID', String(userID));
  data.append('shipmentID', String(shipmentID));
  data.append('comment', String(comment));
  const url = `${BASE_URL}shipment/shipment/comment/post`;

  return axiosClient.postForm(url, data);
}

export function orderException({
  comment,
  companyID,
  shipmentID,
  userID,
  reasonID,
  photoImage
}: IOptionalExceptionProps): Promise<AxiosResponse<unknown>> {
  const data = new FormData();
  data.append('companyID', String(companyID));
  data.append('userID', String(userID));
  data.append('shipmentID', String(shipmentID));
  data.append('comment', String(comment));
  data.append('reasonID', String(reasonID));
  if (photoImage) data.append('photoImage', String(photoImage));
  const url = `${BASE_URL}shipment/event/exception/post`;

  return axiosClient.postForm(url, data);
}

export function sendCOD({
  companyID,
  shipmentID,
  userID,
  codAmount,
  codCheck,
  codTypeID,
}: ISendCOD): Promise<AxiosResponse<unknown>> {
  const data = new FormData();
  data.append('companyID', String(companyID));
  data.append('shipmentID', String(shipmentID));
  data.append('userID', String(userID));
  data.append('codAmount', String(codAmount));
  data.append('codTypeID', String(codTypeID));
  console.log("sending COD: ", codTypeID);
  if (codCheck) data.append('createdSource', String(codCheck));

  const url = `${BASE_URL}shipment/event/cod/post`;

  return axiosClient.postForm(url, data);
}

export function completeOrder({
  companyID,
  shipmentID,
  userID,
  barcode,
  photoImage,
  signatureImage,
  podName,
  comment,
}: ICompleteOrder & { barcode: string }): Promise<AxiosResponse<unknown>> {
  const data = new FormData();
  data.append('companyID', String(companyID));
  data.append('userID', String(userID));
  data.append('shipmentID', String(shipmentID));
  data.append('barcode', String(barcode));
  data.append('podName', String(podName));
  data.append('signatureImage', String(signatureImage));
  if (comment) data.append('comment', String(comment));
  if (photoImage) data.append('photoImage', String(photoImage));

  const url = `${BASE_URL}shipment/event/dispatch/post`;

  return axiosClient.postForm(url, data);
}
