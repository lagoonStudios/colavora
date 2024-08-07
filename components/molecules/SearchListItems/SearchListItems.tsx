import {
  View,
  Text,
  useThemeColor,
  ActivityIndicator,
} from "@components/Themed";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Pressable } from "react-native";
import { SearchListItemProps } from "./SearchListItems.types";
import { styles } from "./SearchListItems.styles";
import { useTranslation } from "react-i18next";

export default function SearchListItems(props: SearchListItemProps) {
  const { loading, data } = props;
  // --- Hooks -----------------------------------------------------------------
  const { default: backgroundColor } = useThemeColor({}, "background");
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <View style={[styles.dataContainer, { backgroundColor }]}>
      {loading && <ActivityIndicator />}
      {!loading && data.length == 0 && (
        <Text style={styles.containerLabel}>{t("SEARCH.NO_RESULTS")}</Text>
      )}
      {!loading && data.length > 0 && (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "ShipmentDetails",
                params: { shipmentID: item["value"] },
              }}
              style={[styles.listItemContainer]}
              asChild
            >
              <Pressable>
                <Text style={styles.contentText}>{item["label"]}</Text>
              </Pressable>
            </Link>
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.listItemSeparator} />
          )}
        />
      )}
    </View>
  );
}
