import React from "react";
import { useTranslation } from "react-i18next";

import { View, Text } from "@components/Themed";

import { styles } from "./OrderListItem.styles";
import { TOrderListItemProps } from "./OrderList.types";

export default function OrderListItem(props: TOrderListItemProps) {
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
