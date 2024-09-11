import { IOptionalCommentsProps } from "@constants/types/shipments";

export interface IOrderNotes {
  comments?: Pick<IOptionalCommentsProps, "shipmentID" | "comment" | "createdDate">[];
  loading: boolean;
}
