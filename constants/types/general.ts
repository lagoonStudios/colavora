export interface IFetchUserData {
  active: boolean;
  companyID: string;
  driverID: number;
  driverName: string;
  userID: number;
  logo?: string;
  lastName?: string
  deptID?: number
  secAdmin?: boolean
  secImgView?: boolean
  secImgIndex?: boolean
  secMess?: boolean
  secGroup?: number
  deptID2?: number
  sendEmail?: boolean
  viewDept?: boolean
  showMssEmail?: boolean
  siteID?: number
  changePassword?: boolean
  typeID?: number
  clientGroup1?: number
  clientGroup2?: number
  clientViewOnly?: boolean
  clientViewLimitActive?: boolean
  dashboardID?: number
  menu?: string
  secDelete?: number
  userPublicID?: string
  multipleDashboard?: boolean
  createdDate?: string
  createduser?: number
  sha?: boolean
  uUserID?: string
  active2?: boolean
  ipOverwrite?: any
  auth0?: string
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
  lang: string
}

export interface ICODData {
  companyID: string;
  codTypeID: number;
  codType: string;
  lang: string;
}

export type PaginatedData = {
  page: number;
  page_size: number;
};

export interface IStateModal {
  visible: boolean;
  message: string;
}

export type Language = "en" | "es";

export type SyncPeriod = 5 | 10 | 20 | 30 | 60;

export enum ShipmentStatus {
  CREATED = "CREATED",
  ASSIGNED = "ASSIGNED",
  COMPLETED = "COMPLETED",
}