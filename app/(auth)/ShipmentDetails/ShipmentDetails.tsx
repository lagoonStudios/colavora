import { useTranslation } from "react-i18next";
import React, { useCallback, useState } from "react";

import ShipmentDetail from "@organisms/ShipmentDetail";
import ShipmentPieces from "@organisms/ShipmentPieces";
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
        case ShipmentDetailsTabsItem.COMMENTS:
          return <ShipmentComments />;
        //TODO Make these components
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
