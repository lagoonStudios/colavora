import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable } from "react-native";

import { styles } from "./OrdersList.styles";
import OrderListItem from "@molecules/OrderListItem";
import PageHeader from "@molecules/PageHeader/PageHeader";
import { ActivityIndicator, View } from "@components/Themed";
import { OrderListItemProps } from "@molecules/OrderListItem/OrderList.types";

import { useOrdersListData } from "./OrdersList.functions";

export default function OrdersList() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { data, loading } = useOrdersListData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: OrderListItemProps }) => (
    <Pressable>
      <OrderListItem {...item} />
    </Pressable>
  );
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
      <PageHeader
        title={`${t("ORDERS.ORDERS")} ${data.length ? `(${data.length})` : ""}`}
      />
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
    </View>
  );
}
