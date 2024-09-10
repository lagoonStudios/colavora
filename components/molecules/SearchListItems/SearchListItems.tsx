import {
  View,
  Text,
  useThemeColor,
  ActivityIndicator,
} from "@components/Themed";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Pressable } from "react-native";
import { SearchListItemProps } from "./SearchListItems.types";
import { styles } from "./SearchListItems.styles";
import { useTranslation } from "react-i18next";
import { getShipmenDetailsById } from "@hooks/SQLite";
import { useStore } from "@stores/zustand";

export default function SearchListItems(props: SearchListItemProps) {
  const { loading, data } = props;
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { push } = useRouter();
  const { default: backgroundColor } = useThemeColor({}, "background");
  const { addShipment } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data Handlers ------------------------------------------------------------
  const onPressItem = useCallback((shipmentID: string) => {
    getShipmenDetailsById({ shipmentID: Number(shipmentID) }).then((value) => {
      addShipment(value)
      push("ShipmentDetails")
    })
  }, [])
  // --- END: Data Handlers -------------------------------------------------------

  return (
    <View style={[styles.dataContainer, { backgroundColor }]}>
      {loading && <ActivityIndicator />}
      {!loading && data.length == 0 && (
        <Text style={styles.containerLabel}>{t("SEARCH.NO_RESULTS")}</Text>
      )}
      {!loading && data.length > 0 && (
        <FlatList
          data={data}
          renderItem={({ item }) => {
            const handler = () => onPressItem(item["value"])

            return (
              <View
                style={[styles.listItemContainer]}
              >
                <Pressable onPress={handler}>
                  <Text style={styles.contentText}>{item["label"]}</Text>
                </Pressable>
              </View>

            )
          }}
          ItemSeparatorComponent={() => (
            <View style={styles.listItemSeparator} />
          )}
        />
      )}
    </View>
  );
}
