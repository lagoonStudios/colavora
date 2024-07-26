import React from "react";
import { Text, View } from "@components/Themed";
import MapScreen from "@organisms/MapScreen";
import { TShipmentDetailProps } from "./ShipmentDetail.constants";
import { styles } from "./ShipmentDetail.styles";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";

export default function ShipmentDetails(props: TShipmentDetailProps) {
  const { shipment } = props;
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapScreen />
      </View>
      <ScrollView>
        <View style={styles.infoContainer}>
          <View style={styles.section}>
            <Text style={styles.textHeader}>{shipment?.consigneeName}</Text>
            <Text style={styles.textSubtitle}>City, {shipment?.zip}</Text>
            <Text style={styles.textBody}>
              {shipment?.senderName} - {shipment?.serviceTypeName}
            </Text>
            <Text style={styles.textBody}>{shipment?.addressLine1}</Text>
            <Text style={styles.textBody}>{shipment?.addressLine2}</Text>
            <Text style={styles.textBody}>{shipment?.phoneNumber}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.textBody}>
              {shipment?.dueDate.toLocaleString()}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.STATUS")}: {shipment?.status}
            </Text>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.WAYBILL")}: {shipment?.waybill}
            </Text>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.INVOICE")}: {shipment?.waybill}
            </Text>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.SERVICE_TYPE")}: {shipment?.serviceTypeName}
            </Text>
            <Text style={styles.textBody}>
              {t("SHIPMENT_DETAILS.PIECES")}: {shipment?.qty}
            </Text>
          </View>
          {shipment?.codAmount > 0 && (
            <View style={styles.section}>
              <Text style={styles.textBody}>
                {t("SHIPMENT_DETAILS.COD")}: {shipment?.codAmount}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
