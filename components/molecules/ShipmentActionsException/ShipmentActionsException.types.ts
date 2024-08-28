import { ShipmentActionsButtonItem } from "@organisms/ShipmentActions/ShipmentAction.constants";
import { ShipmentDetailsTabsItem } from "@templates/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";
import { ImagePickerAsset } from "expo-image-picker";

export interface IOrderExceptionForm {
  comment: string;
  reasonID: number;
  photoImage: ImagePickerAsset;
}

export interface IShipmentActionsException {
  setSelectedTab: React.Dispatch<React.SetStateAction<ShipmentDetailsTabsItem>>;
  setOption: (option: ShipmentActionsButtonItem) => void
}
