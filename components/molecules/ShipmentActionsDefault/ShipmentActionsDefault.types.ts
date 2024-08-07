import { ShipmentActionsButtonItem } from "@organisms/ShipmentActions/ShipmentAction.constants";

export interface IShipmentActionsDefault {
  setOption: React.Dispatch<React.SetStateAction<ShipmentActionsButtonItem>>;
}
