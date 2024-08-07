import { useTranslation } from "react-i18next";
import React, { useCallback, useState } from "react";

import { Text } from "@components/Themed";
import ShipmentDetail from "@templates/ShipmentDetail";
import ShipmentPieces from "@templates/ShipmentPieces";
import PageHeader from "@molecules/PageHeader/PageHeader";
import { ActivityIndicator, View } from "@components/Themed";
import ShipmentDetailsTabs from "@organisms/ShipmentDetailsTabs";
import { useShipmentDetailsData } from "./ShipmentDetails.functions";
import { ShipmentDetailsTabsItem } from "@organisms/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";

import { styles } from "./ShipmentDetails.styles";

export default function ShipmentDetails() {
  // --- Hooks -----------------------------------------------------------------
  const { data, loading } = useShipmentDetailsData();
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [selectedTab, setSelectedTab] = useState<ShipmentDetailsTabsItem>(
    ShipmentDetailsTabsItem.DETAILS,
  );
  // --- END: Local state ------------------------------------------------------

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
      switch (selectedTab) {
        case ShipmentDetailsTabsItem.DETAILS:
          return <ShipmentDetail />;
        case ShipmentDetailsTabsItem.PIECES:
          return <ShipmentPieces />;
        //TODO Make these components
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
