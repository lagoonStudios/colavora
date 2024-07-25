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

export interface IFetchOrderData {
  companyID: string;
  shipmentID: number;
  waybill: string;
  serviceType: number;
  serviceTypeName: string;
  packageType: number;
  readyDate: Date;
  dueDate: Date;
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
  createdDate: Date;
  lastTransferDate: Date;
  status: string;
  qty: number;
  items: null;
  templateID: number;
  manifestDL: string;
  manifestPk: string;
  assignPK: number;
  assignDL: number;
  division: string;
  lastEventComment: null;
  reason: null;
  barcode: string;
  referenceNo?: number;
}
