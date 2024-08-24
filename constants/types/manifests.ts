export interface IFetchManifestByIdData {
  companyID?: string;
  shipmentID?: number;
  manifestID?: number;
  manifest: string;
  driverID?: number;
  createdDate?: string;
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
}
