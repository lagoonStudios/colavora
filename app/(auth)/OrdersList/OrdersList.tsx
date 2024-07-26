import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";

import { styles } from "./OrdersList.styles";
import OrderListItem from "@molecules/OrderListItem";
import PageHeader from "@molecules/PageHeader/PageHeader";
import { ActivityIndicator, View } from "@components/Themed";
import { TOrderListItemProps } from "@molecules/OrderListItem/OrderList.types";

import { useOrdersListData } from "./OrdersList.functions";

export default function OrdersList() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { data, loading } = useOrdersListData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: TOrderListItemProps }) => (
    <OrderListItem {...item} />
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
            keyExtractor={(item) => String(item.shipmentID)}
          />
        )}
      </View>
    </View>
  );
}
