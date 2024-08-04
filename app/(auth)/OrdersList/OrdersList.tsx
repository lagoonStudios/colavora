import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";

import { styles } from "./OrdersList.styles";
import OrderListItem from "@molecules/OrderListItem";
import PageHeader from "@molecules/PageHeader/PageHeader";
import { ActivityIndicator, View } from "@components/Themed";

import { useOrdersListData } from "./OrdersList.functions";
import { useStore } from "@stores/zustand";
import { IFetchShipmentByIdData } from "@constants/types";

export default function OrdersList() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { shipmentIds } = useStore();
  const { data, loading } = useOrdersListData(shipmentIds);
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: IFetchShipmentByIdData }) => (
    <OrderListItem {...item} />
  );
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
      <PageHeader
        title={`${t("ORDERS.ORDERS")} (${shipmentIds?.length ?? ""})`}
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
