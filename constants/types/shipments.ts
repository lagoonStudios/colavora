import { IOptionalProps } from "@constants/types/manifests";

export interface IFetchShipmentByIdData {
  companyID?: string;
  shipmentID?: number;
  waybill?: string;
  serviceType?: number;
  serviceTypeName?: string;
  packageType?: number;
  readyDate?: string;
  dueDate?: string;
  codType?: string;
  codAmount?: number;
  sender?: string;
  senderName?: string;
  senderAddressLine1?: string;
  senderAddressLine2?: string;
  senderZip?: string;
  senderPhoneNumber?: string;
  senderContactPerson?: string;
  orderNotes?: string;
  consigneeNum?: string;
  consigneeName?: string;
  addressLine1?: string;
  addressLine2?: string;
  zip?: string;
  phoneNumber?: string;
  contactPerson?: string;
  createdUserID?: number;
  createdDate?: string;
  lastTransferDate?: string;
  status?: ShipmentStatus;
  qty?: number;
  items?: null | object;
  templateID?: number;
  manifestDL?: string;
  manifestPk?: string;
  assignPK?: number;
  assignDL?: number;
  division?: string;
  lastEventComment?: null | string;
  reason?: null | string;
  barcode?: string;
  referenceNo?: null | string;
}
export interface IShipmentDataFromAPI extends IFetchShipmentByIdData {
  driverAssign?: number;
  pieces?: IFetchPiecesByIdData[];
  comments?: string[];  
  manifest?: string;
}

export interface IFetchPiecesByIdData {
  companyID: string;
  shipmentID: number;
  pieceID: number
  barcode: string
  packageType: number
  packageTypeName: string
  comments?: null | string | [string];
  pwBack?: string;
  pod?: string;
}

export type TGeneralOptionsProps = {
  userID: number,
  companyID: string,
  shipmentID: number
}

export interface IOptionalShipmentProps extends IOptionalProps {
  readyDate?: string;
}
export interface IOptionalPiecesProps extends IOptionalShipmentProps { }
export interface IOptionalCommentsProps extends IOptionalShipmentProps {
  userID: number;
  shipmentID: number;
  comment: string;
  createdDate?: string;
}
export interface IRequiredCommentsProps {
  shipmentID: number;
  comment: string;
  companyID: string;
  createdDate: string;
}

export type IOptionalExceptionProps = Required<Pick<TGeneralOptionsProps, "companyID" | "userID" | "shipmentID">>
  & { reasonID: string, photoImage?: string, comment?: string }


export type ISendCOD = Required<Pick<TGeneralOptionsProps, "shipmentID">>
  & {
    codAmount: number,
    codTypeID: number,
    codCheck?: string,
  }

export interface ICompleteOrder extends TGeneralOptionsProps {
  barcode?: string;
  photoImage?: string;
  signatureImage?: string;
  podName?: string;
  comment?: string
}

export enum ShipmentStatus {
  CREATED = "Created",
  PICKED_UP = "PickedUp",
  INBOUND = "Inbound",
  ASSIGNED = "Assigned",
  OUT_FOR_DELIVERY = "Our for Delivery",
  /** Considered as Competed */
  DELIVERED = "Delivered",
  /** Considered as Competed */
  PARTIAL_DELIVERY = "Partial Delivery",
  ROUNDTRIP = "Roundtrip",
  /** Considered as Competed */
  CANCELLED = "Canceled",
  /** Considered as Competed */
  COMPLETED = "Completed",
  UNASSIGN = "Unassign"
}

export type ShipmentStatusCompleted =
  Extract<ShipmentStatus,
    typeof ShipmentStatus.COMPLETED |
    typeof ShipmentStatus.CANCELLED |
    typeof ShipmentStatus.PARTIAL_DELIVERY |
    typeof ShipmentStatus.DELIVERED
  >


