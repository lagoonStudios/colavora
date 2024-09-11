import { IOptionalCommentsProps } from "@constants/types/shipments";

export interface IOrderNotes {
  notes?: Pick<IOptionalCommentsProps, "shipmentID" | "comment" | "createdDate">;
}
