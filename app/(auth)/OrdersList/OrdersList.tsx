import { SafeAreaView } from "@atoms/SafeAreaView";
import { ActivityIndicator, Text, View } from "@components/Themed";
import React from "react";
import { styles } from "./OrdersList.styles";
import { FlatList, Pressable } from "react-native";
import { useOrdersListData } from "./OrdersList.functions";
import OrderListItem from "@molecules/OrderListItem";
import { OrderListItemProps } from "@molecules/OrderListItem/OrderList.types";
import { useTranslation } from "react-i18next";

export default function OrdersList() {
  // --- Hooks -----------------------------------------------------------------
  const { data, loading } = useOrdersListData();
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: OrderListItemProps }) => (
    <Pressable>
      <OrderListItem {...item} />
    </Pressable>
  );
  // --- END: Data and handlers ------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {t("ORDERS.ORDERS")} {data.length ? `(${data.length})` : 0}
        </Text>
      </View>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
