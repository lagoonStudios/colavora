import { IFetchShipmentByIdData } from "@constants/types/shipments";

export type IFetchOrderListItem = Pick<IFetchShipmentByIdData,
    'consigneeName' |
    'zip' |
    'senderName' |
    'serviceTypeName' |
    'addressLine1' |
    'addressLine2' |
    'referenceNo' |
    'qty'>