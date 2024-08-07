import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import ShipmentDetail from "@organisms/ShipmentDetail";
import ShipmentPieces from "@organisms/ShipmentPieces";
import ShipmentActions from "@organisms/ShipmentActions";
import ShipmentComments from "@organisms/ShipmentComments";

import PageHeader from "@molecules/PageHeader/PageHeader";
import ShipmentDetailsTabs from "@templates/ShipmentDetailsTabs";
import { Text, ActivityIndicator, View } from "@components/Themed";
import { ShipmentDetailsTabsItem } from "@templates/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";

import { styles } from "./ShipmentDetails.styles";
import { useShipmentDetailsData } from "./ShipmentDetails.functions";

export default function ShipmentDetails() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { data, loading } = useShipmentDetailsData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [selectedTab, setSelectedTab] = useState<ShipmentDetailsTabsItem>(
    ShipmentDetailsTabsItem.DETAILS,
  );
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderView = useCallback(() => {
    if (data === undefined) {
      if (loading)
        return (
          <View style={{ margin: "auto" }}>
            <ActivityIndicator />
          </View>
        );
      else return <Text>No data</Text>;
    } else {
      switch (selectedTab) {
        case ShipmentDetailsTabsItem.DETAILS:
          return <ShipmentDetail />;
        case ShipmentDetailsTabsItem.PIECES:
          return <ShipmentPieces />;
        case ShipmentDetailsTabsItem.COMMENTS:
          return <ShipmentComments />;
        case ShipmentDetailsTabsItem.ACTIONS:
          return <ShipmentActions />;
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
