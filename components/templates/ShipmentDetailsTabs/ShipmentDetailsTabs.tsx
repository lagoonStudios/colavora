import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import Chip from "@atoms/Chip";
import { View } from "@components/Themed";
import { styles } from "./ShipmentDetailsTabs.styles";
import {
  TShipmentDetailsTabsProps,
  ShipmentDetailsTabsItem,
} from "./ShipmentDetailsTabs.constants";

export default function ShipmentDetailsTabs(props: TShipmentDetailsTabsProps) {
  // --- Local state -----------------------------------------------------------
  const { style, selectedTab, setSelectedTab } = props;
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const setSelectedTabHandler = useCallback(
    (option: ShipmentDetailsTabsItem) => {
      setSelectedTab(option);
    },
    [setSelectedTab],
  );
  // --- END: Data and handlers ------------------------------------------------
  return (
    <View style={[styles.container, style]}>
      {[
        {
          label: t("SHIPMENT_DETAILS.DETAILS"),
          onPress: () => setSelectedTabHandler(ShipmentDetailsTabsItem.DETAILS),
          active: selectedTab === ShipmentDetailsTabsItem.DETAILS,
          key: `shipment-detail-tab-${t("SHIPMENT_DETAILS.DETAILS")}`,
        },
        {
          label: t("SHIPMENT_DETAILS.PIECES"),
          onPress: () => setSelectedTabHandler(ShipmentDetailsTabsItem.PIECES),
          active: selectedTab === ShipmentDetailsTabsItem.PIECES,
          key: `shipment-detail-tab-${t("SHIPMENT_DETAILS.PIECES")}`,
        },
        {
          label: t("SHIPMENT_DETAILS.COMMENTS"),
          onPress: () =>
            setSelectedTabHandler(ShipmentDetailsTabsItem.COMMENTS),
          active: selectedTab === ShipmentDetailsTabsItem.COMMENTS,
          key: `shipment-detail-tab-${t("SHIPMENT_DETAILS.COMMENTS")}`,
        },
        {
          label: t("SHIPMENT_DETAILS.ACTIONS"),
          onPress: () => setSelectedTabHandler(ShipmentDetailsTabsItem.ACTIONS),
          active: selectedTab === ShipmentDetailsTabsItem.ACTIONS,
          key: `shipment-detail-tab-${t("SHIPMENT_DETAILS.ACTIONS")}`,
        },
      ].map(({ active, label, onPress, key }) => (
        <Chip label={label} active={active} onPress={onPress} key={key} />
      ))}
    </View>
  );
}
