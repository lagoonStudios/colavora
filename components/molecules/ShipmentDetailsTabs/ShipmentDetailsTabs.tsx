import React from "react";
import { ViewStyle } from "react-native";

import Chip from "@atoms/Chip";
import { View } from "@components/Themed";
import { styles } from "./ShipmentDetailsTabs.styles";
import {
  TShipmentDetailsTabsProps,
  ShipmentDetailsTabsItem,
} from "./ShipmentDetailsTabs.constants";
import { useTranslation } from "react-i18next";

export default function ShipmentDetailsTabs(props: TShipmentDetailsTabsProps) {
  const { style, selectedTab, setSelectedTab } = props;
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  // --- END: Data and handlers ------------------------------------------------
  return (
    <View style={[styles.container, style]}>
      <Chip
        label={t("SHIPMENT_DETAILS.DETAILS")}
        onPress={() => setSelectedTab(ShipmentDetailsTabsItem.DETAILS)}
        active={selectedTab === ShipmentDetailsTabsItem.DETAILS}
      />
      <Chip
        label={t("SHIPMENT_DETAILS.PIECES")}
        onPress={() => setSelectedTab(ShipmentDetailsTabsItem.PIECES)}
        active={selectedTab === ShipmentDetailsTabsItem.PIECES}
      />
      <Chip
        label={t("SHIPMENT_DETAILS.COMMENTS")}
        onPress={() => setSelectedTab(ShipmentDetailsTabsItem.COMMENTS)}
        active={selectedTab === ShipmentDetailsTabsItem.COMMENTS}
      />
      <Chip
        label={t("SHIPMENT_DETAILS.ACTIONS")}
        onPress={() => setSelectedTab(ShipmentDetailsTabsItem.ACTIONS)}
        active={selectedTab === ShipmentDetailsTabsItem.ACTIONS}
      />
    </View>
  );
}
