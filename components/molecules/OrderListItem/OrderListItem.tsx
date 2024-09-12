import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { View, Text } from "@components/Themed";

import { styles } from "./OrderListItem.styles";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useStore } from "@stores/zustand";
import { getShipmenDetailsById } from "@hooks/SQLite";
import { useCoordinatesFromAddress } from "@organisms/ShipmentDetail/ShipmentDetail.functions";
import { IFetchOrderListItem } from "@hooks/SQLite/SQLite.types";

export default function OrderListItem(props: IFetchOrderListItem) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { addShipment } = useStore();
  const { push } = useRouter();
  const { city } = useCoordinatesFromAddress({
    address: props?.addressLine1?.concat(props?.addressLine2 ?? "") ?? "",
    zipCode: props?.zip ?? "",
  })
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const setShipmentHandler = () => {
    if (props.shipmentID && props.shipmentID !== null) {
      getShipmenDetailsById({ shipmentID: props.shipmentID }).then((shipment) => {
        addShipment(shipment);
        push({ pathname: "ShipmentDetails" })
      })
    }
  };

  const containerStyle = useMemo(() => {
    if (props?.index)
      if (props.index % 2 !== 0) return styles.oddContainer
    return styles.container
  }, [props?.index])
  // --- END: Data and handlers ------------------------------------------------

  return (
    <Pressable style={containerStyle} onPress={setShipmentHandler}>
      <View style={styles.defaultInternalContainer}>
        <Text style={styles.title}>{props.consigneeName}</Text>
        <Text style={styles.title}>{city}</Text>
      </View>
      <View style={styles.defaultInternalContainer}>
        <Text style={styles.bodyText}>
          {props.senderName} - {props.serviceTypeName}
        </Text>
        <Text style={styles.bodyText}>{props.addressLine1}</Text>
        <Text style={styles.bodyText}>{props.addressLine2}</Text>
        <Text style={styles.bodyText}>({props.referenceNo})</Text>
        <Text style={styles.piecesLabel}>
          {t("COMMON.PIECES")}: {props.qty}
        </Text>
      </View>
    </Pressable>
  );
}
