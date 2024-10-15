import { IShipmentDataFromAPI } from "./shipments";
export interface IFetchManifestOfflineData {
  manifestId: string;
  manifestType: string;
  manifestDate: string;
  shipments: IShipmentDataFromAPI[];
}

export interface IFetchManifestByIdData extends IFetchManifestOfflineData {
  companyID?: string;
  shipmentID?: number;
  manifest?: string;
  driverID?: number;
}

export interface IOptionalProps {
  driverId?: string;
  companyID?: string;
  status?: string;
  createdDate?: string;
  id?: string;
  manifest?: string;
  optionalKey?: string;
  language?: string;
  authId?: string;
}
