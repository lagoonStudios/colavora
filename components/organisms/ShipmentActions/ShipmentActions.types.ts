import { ShipmentDetailsTabsItem } from "@templates/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";

export interface IShipmentActions {
  setSelectedTab: React.Dispatch<React.SetStateAction<ShipmentDetailsTabsItem>>;
}
