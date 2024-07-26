import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";

import { View } from "@components/Themed";
import PageHeader from "@molecules/PageHeader/PageHeader";
import ShipmentDetailsTabs from "@molecules/ShipmentDetailsTabs";

import { Text } from "@components/Themed";
import { styles } from "./ShipmentDetails.styles";
import { useShipmentDetailsData } from "./ShipmentDetails.functions";
import { ShipmentDetailsTabsItem } from "@molecules/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";
import ShipmentDetail from "@templates/ShipmentDetail";

export default function ShipmentDetails() {
  // --- Hooks -----------------------------------------------------------------
  const { shipmentID } = useLocalSearchParams<{ shipmentID: string }>();
  const { data, loading, error } = useShipmentDetailsData(shipmentID);
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<ShipmentDetailsTabsItem>(
    ShipmentDetailsTabsItem.DETAILS
  );
  // --- END: Hooks ------------------------------------------------------------

  useEffect(() => {
    console.log(selectedTab);
  }, [selectedTab]);
  return (
    <View style={styles.container}>
      <PageHeader title={t("SHIPMENT_DETAILS.SHIPMENT_DETAILS")} />
      <ShipmentDetailsTabs
        style={styles.tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {selectedTab === ShipmentDetailsTabsItem.DETAILS && (
        <ShipmentDetail shipment={data} />
      )}
    </View>
  );
}
