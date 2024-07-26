import { IFetchOrderData } from "@constants/types";

export type TOrderListItemProps = Pick<
    IFetchOrderData,
    'shipmentID' |
    'consigneeName' |
    'senderName' |
    'addressLine1' |
    'addressLine2' |
    'zip' |
    'serviceTypeName' |
    'referenceNo' |
    'qty'
>