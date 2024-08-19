export const EmailRegex = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

export const mockDriverId = "2";
export const mockCompanyId = 10029;
export const mockUserID = 0;

export const defaultLocation = { lat: 18.220833, lng: -66.590149 };
export const queryKeys = {
  driverData: "driverData",
  companyData: "companyData",
  statusIdData: "statusIdData",
  statusByIdData: "statusByIdData",
  manifestsIdData: "manifestsIdData",
  pickupIdData: "pickupIdData",
  manifestsByIdData: "manifestsByIdData",
  shipmentsIdData: "shipmentsIdData",
  shipmentsByIdData: "shipmentsByIdData",
  piecesIdData: "piecesIdData",
  piecesByIdData: "piecesByIdData",
  commnetsByIdData: "commnetsByIdData",
  reasonsIdData: "reasonsIdData",
  reasonsByIdData: "reasonsByIdData",
  CODIdData: "CODIdData",
  CODByIdData: "CODByIdData",
};

export const labelStatuses = {
  manifest: {
    created: "Created",
    assigned: "Assigned",
    ourForDelivery: "Our for Delivery",
  },
  pickup: {
    pickedUp: "PickedUp",
  },
};