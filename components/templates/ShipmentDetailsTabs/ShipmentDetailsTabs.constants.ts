import { ViewStyle } from "react-native";

export enum ShipmentDetailsTabsItem {
  DEFAULT,
  DETAILS,
  PIECES,
  COMMENTS,
  ACTIONS,
}

export type TShipmentDetailsTabsProps = {
  style: ViewStyle;
  selectedTab: ShipmentDetailsTabsItem;
  setSelectedTab: (tab: ShipmentDetailsTabsItem) => void;
};
