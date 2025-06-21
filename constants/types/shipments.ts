import { TShipmentInsertData } from "@/db/schema/shipments";
import { IOptionalProps } from "@constants/types/manifests";
import { TRemoveEventOptions } from "@hooks/eventsQueue/eventsQueue.types";

export interface IFetchShipmentByIdData extends TShipmentInsertData {
  driverAssign: number | null;
}
export interface IShipmentDataFromAPI extends IFetchShipmentByIdData {
  pieces?: IFetchPiecesByIdData[];
  comments?: string[];
  manifest: number;
}

export interface IFetchPiecesByIdData {
  companyID: string;
  shipmentID: number;
  pieceID: number;
  barcode: string;
  packageType: number;
  packageTypeName: string;
  comments?: null | string | [string];
  pwBack?: string;
  pod?: string;
}

export type TGeneralOptionsProps = {
  userID: number;
  companyID: string;
  shipmentID: number;
};

export interface IOptionalShipmentProps extends IOptionalProps {
  readyDate?: string;
}
export interface IOptionalPiecesProps extends IOptionalShipmentProps {}
export interface IOptionalCommentsProps extends IOptionalShipmentProps {
  userID: number;
  shipmentID: number;
  comment: string;
  createdDate?: string;
}
export interface IRequiredCommentsProps {
  shipmentID: number;
  comment: string;
  companyID: string;
  createdDate: string;
}

export type IOptionalExceptionProps = Required<
  Pick<TGeneralOptionsProps, "companyID" | "userID" | "shipmentID">
> & { reasonID: string; photoImage?: string; comment?: string };

export type ISendCOD = Required<
  Pick<TGeneralOptionsProps, "shipmentID" | "userID" | "companyID">
> & {
  codAmount: number;
  codTypeID: number;
  codCheck?: string;
};

export type ICompleteOrder = Required<
  Pick<TGeneralOptionsProps, "shipmentID" | "userID" | "companyID">
> & {
  barcodes: string[];
  podName: string;
  signatureImage?: string;
  comment?: string;
  photoImage?: string;
};

export type ICompleteOrderAllBarcodes = Required<
  Pick<TGeneralOptionsProps, "shipmentID" | "userID" | "companyID">
> & {
  barcodes: string[];
  podName: string;
  signatureImage?: string;
  comment?: string;
  photoImage?: string;
};

export type CompleteOrderMutationProps = {
  order: ICompleteOrder;
  options: Required<TRemoveEventOptions>;
};

export enum ShipmentStatus {
  CREATED = "Created",
  PICKED_UP = "PickedUp",
  INBOUND = "Inbound",
  ASSIGNED = "Assigned",
  OUT_FOR_DELIVERY = "Our for Delivery",
  /** Considered as Competed */
  DELIVERED = "Delivered",
  /** Considered as Competed */
  PARTIAL_DELIVERY = "Partial Delivery",
  ROUNDTRIP = "Roundtrip",
  /** Considered as Competed */
  CANCELLED = "Canceled",
  /** Considered as Competed */
  COMPLETED = "Completed",
  UNASSIGN = "Unassign",
}

export type ShipmentStatusCompleted = Extract<
  ShipmentStatus,
  | typeof ShipmentStatus.COMPLETED
  | typeof ShipmentStatus.CANCELLED
  | typeof ShipmentStatus.PARTIAL_DELIVERY
  | typeof ShipmentStatus.DELIVERED
>;
