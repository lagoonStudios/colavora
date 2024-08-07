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

export interface IFetchStatusByIdData {
  companyID: string;
  statusID: number;
  status: string;
  completed: boolean;
}

export interface IReasonsByIdData {
  reasonID: number;
  companyID: string;
  customerID: number;
  reasonCode: string;
  reasonDesc: string;
  reasonCodeDesc: string;
  completeOrder: boolean;
}

export interface ICODData {
  companyID: string;
  codTypeID: number;
  codType: string;
}
