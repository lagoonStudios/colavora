import React from "react";
import { useTranslation } from "react-i18next";

import { View, Text } from "@components/Themed";
import { IFetchShipmentByIdData } from "@constants/types/shipments";

import { styles } from "./OrderListItem.styles";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useStore } from "@stores/zustand";
import { getShipmenDetailsById } from "@hooks/SQLite";
import { useCoordinatesFromAddress } from "@organisms/ShipmentDetail/ShipmentDetail.functions";

export default function OrderListItem(props: IFetchShipmentByIdData) {
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
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View>
      <Pressable style={styles.container} onPress={setShipmentHandler}>
        <View>
          <Text style={styles.title}>{props.consigneeName}</Text>
          <Text style={styles.title}>{city}</Text>
        </View>
        <View>
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
    </View>
  );
}
