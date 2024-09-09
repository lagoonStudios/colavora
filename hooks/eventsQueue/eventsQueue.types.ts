import { IOptionalExceptionProps } from "@constants/types/shipments"

export type TRemoveEventOptions = {
    eventId: number,
    removeFromQueue: (id: number) => void,
    removeIdFromHandleList: (id: number) => void,
}

export enum EventsQueueType {
    ORDER_EXCEPTION = 'ORDER_EXCEPTION',
    ORDER_COMPLETED = 'ORDER_COMPLETED',
    ADD_COMMENT = "ADD_COMMENT"
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
            "shipmentID" |
            "comment" |
            "reasonID"
        >>
    & Partial<Pick<IOptionalExceptionProps, "photoImage">>
    & { commentCreatedDate: string, reasonCode: string }