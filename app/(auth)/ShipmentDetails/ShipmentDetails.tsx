import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";

import { Text } from "@components/Themed";
import ShipmentDetail from "@templates/ShipmentDetail";
import PageHeader from "@molecules/PageHeader/PageHeader";
import { ActivityIndicator, View } from "@components/Themed";
import ShipmentDetailsTabs from "@molecules/ShipmentDetailsTabs";
import { useShipmentDetailsData } from "./ShipmentDetails.functions";
import { ShipmentDetailsTabsItem } from "@molecules/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";

import { styles } from "./ShipmentDetails.styles";

export default function ShipmentDetails() {
  // --- Hooks -----------------------------------------------------------------
  const { shipmentID } = useLocalSearchParams<{ shipmentID: string }>();
  const { data, loading, error } = useShipmentDetailsData(shipmentID);
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<ShipmentDetailsTabsItem>(
    ShipmentDetailsTabsItem.DETAILS
  );
  // --- END: Hooks ------------------------------------------------------------
  // --- Data and handlers -----------------------------------------------------
  const renderView = useCallback(() => {
    if (data === undefined && loading) {
      return (
        <View style={{ margin: "auto" }}>
          <ActivityIndicator />
        </View>
      );
    } else if (data === undefined && !loading) {
      //TODO handle error
      return <Text>No data</Text>;
    } else {
      if (data === undefined) return null;
      console.log(JSON.stringify(data));
      switch (selectedTab) {
        case ShipmentDetailsTabsItem.DETAILS:
          return <ShipmentDetail shipment={data} />;
        //TODO Make these components
        // case ShipmentDetailsTabsItem.PIECES:
        //   return <ShipmentPieces shipment={data} />;
        // case ShipmentDetailsTabsItem.COMMENTS:
        //   return <ShipmentComments shipment={data} />;
        // case ShipmentDetailsTabsItem.ACTIONS:
        //   return <ShipmentActions shipment={data} />;
        default:
          return <Text style={{ margin: "auto" }}>En construcción</Text>;
      }
    }
  }, [data, selectedTab, loading]);
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
      <PageHeader title={t("SHIPMENT_DETAILS.SHIPMENT_DETAILS")} />
      <ShipmentDetailsTabs
        style={styles.tabs}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {renderView()}
    </View>
  );
}
