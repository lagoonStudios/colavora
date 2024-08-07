import { IFetchShipmentByIdData } from "@constants/types/shipments";

export type TOrderListItemProps = Pick<
  IFetchShipmentByIdData,
  | "shipmentID"
  | "consigneeName"
  | "senderName"
  | "addressLine1"
  | "addressLine2"
  | "zip"
  | "serviceTypeName"
  | "referenceNo"
  | "qty"
>;
