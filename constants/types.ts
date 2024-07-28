export interface IFetchDriverData {
  active: boolean;
  companyID: string;
  driverID: number;
  driverName: string;
  userID: number;
}

export interface IFetchCompanyData {
  companyID: string;
  companyName: string;
  logo: string;
  slogan: string;
  tel1: string;
  ext: string;
  tel2: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  contact: string;
  position: string;
  contactEmail: string;
  companyEmail: string;
}

export interface IFetchManifestByIdData {
  companyID: string;
  shipmentID: number;
  manifestID: number;
  manifest: string;
  driverID: number;
  createdDate: string;
}
export interface IFetchShipmentByIdData {
  companyID: string;
  shipmentID: number;
  waybill: string;
  serviceType: number;
  serviceTypeName: string;
  packageType: number;
  readyDate: string;
  dueDate: string;
  codType: string;
  codAmount: number;
  sender: string;
  senderName: string;
  senderAddressLine1: string;
  senderAddressLine2: string;
  senderZip: string;
  senderPhoneNumber: string;
  senderContactPerson: string;
  orderNotes: string;
  consigneeNum: string;
  consigneeName: string;
  addressLine1: string;
  addressLine2: string;
  zip: string;
  phoneNumber: string;
  contactPerson: string;
  createdUserID: number;
  createdDate: string;
  lastTransferDate: string;
  status: string;
  qty: number;
  items?: null | object;
  templateID: number;
  manifestDL: string;
  manifestPk: string;
  assignPK: number;
  assignDL: number;
  division: string;
  lastEventComment?: null | string;
  reason?: null | string;
  barcode: string;
  referenceNo?: null | string;
}

export interface IFetchPiecesByIdData {
  companyID: string;
  shipmentID: number;
  pieceID: number;
  barcode: string;
  packageType: number;
  packageTypeName: string;
  comments?: null | string | [string];
  pwBack: string;
  pod: string;
}

export interface IFetchStatusByIdData {
  companyID: string;
  statusID: number;
  status: string;
  completed: boolean;
}

export interface IOptionalManifestProps {
  driverId?: string;
  status?: string;
  createdDate?: string;
  id?: string;
}

export interface IOptionalShipmnetProps extends IOptionalManifestProps {
  readyDate?: string;
}
export interface IOptionalPiecesProps extends IOptionalShipmnetProps {}
