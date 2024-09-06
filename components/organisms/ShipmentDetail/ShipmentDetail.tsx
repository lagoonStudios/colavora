import React from "react";
import { A } from "@expo/html-elements";

import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import MapScreen from "@organisms/MapScreen";
import { Text, View } from "@components/Themed";

import { styles } from "./ShipmentDetail.styles";
import {
  useCoordinatesFromAddress,
  useShipmentData,
} from "./ShipmentDetail.functions";

export default function ShipmentDetails() {
  //-- Data and handlers -----------------------------------------------------

  //-- END: Data and handlers ------------------------------------------------
  // --- Hooks -----------------------------------------------------------------
  const { shipment } = useShipmentData();
  const { t } = useTranslation();
  const { location, city } = useCoordinatesFromAddress({
    address: shipment?.addressLine1?.concat(shipment?.addressLine2 ?? "") ?? "",
    zipCode: shipment?.zip ?? "",
  });

  // --- END: Hooks ------------------------------------------------------------
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapScreen latitude={location.lat} longitude={location.lng} />
      </View>
      <ScrollView>
        <View style={styles.infoContainer}>
          <View style={styles.section}>
            <Text style={styles.textHeader}>
              {shipment?.consigneeName ?? ""}
            </Text>
            <Text style={styles.textSubtitle}>{city ?? ""}</Text>
            <Text style={styles.textBody}>
              {shipment?.senderName ?? ""} - {shipment?.serviceTypeName ?? ""}
            </Text>
            <Text style={styles.textBody}>{shipment?.addressLine1 ?? ""}</Text>
            <Text style={styles.textBody}>{shipment?.addressLine2 ?? ""}</Text>
            <A
              href={"tel:" + shipment?.phoneNumber || ""}
              style={[styles.textBody, styles.phoneNumber]}
            >
              {shipment?.phoneNumber ?? ""}
            </A>
          </View>

          <View style={styles.section}>
            <Text style={styles.textBody}>{shipment?.dueDate}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.STATUS")}: {shipment?.status ?? ""}
            </Text>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.WAYBILL")}: {shipment?.waybill ?? ""}
            </Text>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.INVOICE")}: {shipment?.invoiceBarcode ?? ""}
            </Text>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.SERVICE_TYPE")}:{" "}
              {shipment?.serviceTypeName ?? ""}
            </Text>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.PIECES")}: {shipment?.qty ?? ""}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.COD")}:{" "}
              {shipment?.codAmount && shipment?.codAmount > 0
                ? shipment?.codAmount
                : ""}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
