import {
  ICompleteOrder,
  IOptionalExceptionProps,
  ISendCOD,
} from "@constants/types/shipments";

export enum EventsQueueType {
  ORDER_EXCEPTION = "ORDER_EXCEPTION",
  ORDER_COMPLETED = "ORDER_COMPLETED",
}

export type TRemoveEventOptions = {
  /** Calls when the mutation is a success. Passes all the props from the mutation */
  onSuccess?: (props?: any) => void;
  /** Calls when the mutation is a error. Passes all the props from the mutation */
  onError?: (props?: any) => void;
  eventId?: number;
  // removeFromQueue: (id: number) => void,
  // removeIdFromHandleList: (id: number) => void,
  // addEventToQueue?: (params: TInsertEventParams) => Promise<void>
};

export type TInsertEventParams = Pick<
  TEventQueueData,
  "body" | "shipmentID" | "eventType"
>;

export type TAddEventToQueueProps = {
  addEventToQueue: (params: TInsertEventParams) => Promise<void>;
};

export type TEventQueueData = {
  id: number;
  body: string;
  shipmentID: number;
  eventType: EventsQueueType;
};

export type TOrderExceptionsProps = Required<
  Pick<IOptionalExceptionProps, "shipmentID" | "comment" | "reasonID">
> &
  Partial<Pick<IOptionalExceptionProps, "photoImage">> & {
    options: Required<Pick<TRemoveEventOptions, "eventId">> &
      Partial<Pick<TRemoveEventOptions, "onError" | "onSuccess">>;
  };

export type TSendCommentsProps = {
  comment: string;
  companyID: string;
  shipmentID: number;
  userID: number;
  options?: Required<TRemoveEventOptions>;
};

export type TSendCODSProps = {
  CODS: ISendCOD[];
  options: Required<TRemoveEventOptions>;
};

export type TCompleteOrderProps = ICompleteOrder & { completeCODs: ISendCOD[] };

export type TAddCompleteOrderToQueue = { order: TCompleteOrderProps };

export type TCompleteOrderToApiProps = {
  order: TCompleteOrderProps;
  options: Required<Pick<TRemoveEventOptions, "eventId">>;
};

export type TUseEventsProps = {
  removeFromQueue: (id: number) => void;
  removeIdFromHandleList: (id: number) => void;
  addEventToQueue: (params: TInsertEventParams) => Promise<void>;
};
