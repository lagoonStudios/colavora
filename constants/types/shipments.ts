import { IOptionalManifestProps } from "@constants/types/manifests";

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
  status?: string;
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

export interface IFetchPiecesByIdData {
  companyID?: string;
  shipmentID?: number;
  pieceID?: number;
  barcode?: string;
  packageType?: number;
  packageTypeName?: string;
  comments?: null | string | [string];
  pwBack?: string;
  pod?: string;
}

export interface IOptionalShipmentProps extends IOptionalManifestProps {
  readyDate?: string;
}
export interface IOptionalPiecesProps extends IOptionalShipmentProps {}
export interface IOptionalCommentsProps extends IOptionalShipmentProps {
  userID?: number;
  shipmentID?: number;
  comment?: string;
  companyID?: number;
}

export interface IOptionalExceptionProps extends IOptionalCommentsProps {
  reasonID?: number;
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
