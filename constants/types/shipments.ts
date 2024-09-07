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
  manifest?: string;
  manifestDL?: string;
  manifestPk?: string;
  assignPK?: number;
  assignDL?: number;
  division?: string;
  lastEventComment?: null | string;
  reason?: null | string;
  barcode?: string;
  referenceNo?: null | string;
  pieces: IFetchPiecesByIdData[]
  comments: string[]
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

export interface IOptionalShipmentProps extends IOptionalProps {
  readyDate?: string;
}
export interface IOptionalPiecesProps extends IOptionalShipmentProps { }
export interface IOptionalCommentsProps extends IOptionalShipmentProps {
  userID?: number;
  shipmentID?: number;
  comment?: string;
  createdDate?: string;
}
export interface IRequiredCommentsProps {
  shipmentID: number;
  comment: string;
  companyID: string;
  createdDate: string;
}

export interface IOptionalExceptionProps extends IOptionalCommentsProps {
  reasonID?: number;
  photoImage?: string;
}

export interface ISendCOD extends IOptionalCommentsProps {
  codTypeID?: number;
  codAmount?: number;
  codCheck?: string;
  createdSource?: string;
}

export interface ICompleteOrder extends IOptionalCommentsProps {
  barcode?: string;
  photoImage?: string;
  signatureImage?: string;
  podName?: string;
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


