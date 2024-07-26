import React from "react";
import { View, Text } from "@components/Themed";
import { styles } from "./OrderListItem.styles";
import { OrderListItemProps } from "./OrderList.types";
import { useTranslation } from "react-i18next";

export default function OrderListItem(props: OrderListItemProps) {
  const {
    companyName,
    city,
    zipCode,
    direction,
    bill,
    pieces,
    name,
    serviceType,
  } = props;

  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{companyName}</Text>
        <Text style={styles.title}>
          {city}, {zipCode}
        </Text>
      </View>
      <View>
        <Text style={styles.bodyText}>
          {name} - {serviceType}
        </Text>
        <Text style={styles.bodyText}>{direction}</Text>
        <Text style={styles.bodyText}>({bill})</Text>
        <Text style={styles.piecesLabel}>
          {t("COMMON.PIECES")}: {pieces}
        </Text>
      </View>
    </View>
  );
}
