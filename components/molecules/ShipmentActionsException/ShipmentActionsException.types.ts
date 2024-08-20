import { ShipmentDetailsTabsItem } from "@templates/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";

export interface IOrderExceptionForm {
  comment: string;
  reasonID: number;
}

export interface IShipmentActionsException {
  setSelectedTab: React.Dispatch<React.SetStateAction<ShipmentDetailsTabsItem>>;
}
