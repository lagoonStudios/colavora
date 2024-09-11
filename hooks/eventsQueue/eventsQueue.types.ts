import { ICompleteOrder, IOptionalExceptionProps, ISendCOD } from "@constants/types/shipments"

export enum EventsQueueType {
    ORDER_EXCEPTION = 'ORDER_EXCEPTION',
    ORDER_COMPLETED = 'ORDER_COMPLETED',
    ADD_COMMENT = "ADD_COMMENT",
}

export type TRemoveEventOptions = {
    eventId: number,
    removeFromQueue: (id: number) => void,
    removeIdFromHandleList: (id: number) => void,
    addEventToQueue?: (params: TInsertEventParams) => Promise<void>
}

export type TInsertEventParams = Pick<TEventQueueData, "body" | "shipmentID" | "eventType">

export type TAddEventToQueueProps = {
    addEventToQueue: (params: TInsertEventParams) => Promise<void>
}


export type TEventQueueData = {
    id: number,
    body: string,
    shipmentID: number
    eventType: EventsQueueType,
}


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

export type TCompleteOrderProps = ICompleteOrder & { completeCODs: ISendCOD[] }


export type TAddCompleteOrderToQueue = { order: TCompleteOrderProps }

export type TCompleteOrderToApiProps = { order: TCompleteOrderProps, options: Pick<TRemoveEventOptions, "eventId"> }

export type TUseHandleCompleteOrderEventProps = Required<Pick<TRemoveEventOptions, "removeIdFromHandleList" | "removeFromQueue" | "addEventToQueue">>