import { IFetchOrderData } from "@constants/types";

export type TOrderListItemProps = Pick<
    IFetchOrderData,
    'consigneeName' |
    'senderName' |
    'addressLine1' |
    'addressLine2' |
    'zip' |
    'serviceType' |
    'referenceNo' |
    'qty'
>