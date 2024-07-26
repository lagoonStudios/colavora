import React from "react";
import { useTranslation } from "react-i18next";

import { View, Text } from "@components/Themed";

import { styles } from "./OrderListItem.styles";
import { TOrderListItemProps } from "./OrderList.types";
import { Link } from "expo-router";
import { Pressable } from "react-native";

export default function OrderListItem(props: TOrderListItemProps) {
  const {
    shipmentID,
    consigneeName,
    senderName,
    addressLine1,
    addressLine2,
    zip,
    serviceTypeName,
    referenceNo,
    qty,
  } = props;
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <Link
      href={{ pathname: "ShipmentDetails", params: { shipmentID } }}
      asChild
    >
      <Pressable style={styles.container}>
        <View>
          <Text style={styles.title}>{consigneeName}</Text>
          <Text style={styles.title}>City, {zip}</Text>
        </View>
        <View>
          <Text style={styles.bodyText}>
            {senderName} - {serviceTypeName}
          </Text>
          <Text style={styles.bodyText}>{addressLine1}</Text>
          <Text style={styles.bodyText}>{addressLine2}</Text>
          <Text style={styles.bodyText}>({referenceNo})</Text>
          <Text style={styles.piecesLabel}>
            {t("COMMON.PIECES")}: {qty}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
