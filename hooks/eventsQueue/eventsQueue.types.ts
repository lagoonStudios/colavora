import { IOptionalExceptionProps } from "@constants/types/shipments"

export enum EventsQueueType {
    ORDER_EXCEPTION = 'ORDER_EXCEPTION',
    ORDER_COMPLETED = 'ORDER_COMPLETED',
}

export type TEventQueueData = {
    id: number,
    body: string,
    shipmentID: number
    eventType: EventsQueueType,
}

export type TInsertEventParams = Pick<TEventQueueData, "body" | "shipmentID" | "eventType">

export type TOrderExceptionsProps =
    Required<
        Pick<
            IOptionalExceptionProps,
            "shipmentID" | "comment" |
            "reasonID" |
            "photoImage"
        >>
    &
    { commentCreatedDate: string }