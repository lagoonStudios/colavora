import { IFetchShipmentByIdData } from "@constants/types/shipments";

export type IFetchOrderListItem = Pick<IFetchShipmentByIdData,
    'shipmentID' |
    'consigneeName' |
    'zip' |
    'senderName' |
    'serviceTypeName' |
    'addressLine1' |
    'addressLine2' |
    'referenceNo' |
    'dueDate' |
    'qty'> & { index?: number }