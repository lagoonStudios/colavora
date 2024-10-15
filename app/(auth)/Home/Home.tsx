import React from "react";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable } from "react-native";

import styles from "./Home.styles";
import { HomeItem } from "./Home.types";
import { useHomeData } from "./Home.functions";
import SearchInput from "@organisms/SearchInput";
import { SafeAreaView } from "@atoms/SafeAreaView";
import { ActivityIndicator, Text, View } from "@components/Themed";
import { useStore } from "@stores/zustand";
import { useSyncData } from "@hooks/syncData";
import { getShipmentList } from "@hooks/SQLite";
import eventsQueue from "@hooks/eventsQueue";

export default function Home() {
  // --- Hooks -----------------------------------------------------------------
  useSyncData();

  const { push } = useRouter();
  const { t } = useTranslation();
  const { data, loading } = useHomeData();
  const { addShipmentIds, resetManifestId } = useStore();
  eventsQueue();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: HomeItem }) => {
    const setShipmentIdsHandler = () => {
      void getShipmentList({}).then((shipment) => {
        resetManifestId();
        addShipmentIds(shipment?.map(({ shipmentID }) => shipmentID!));
        push({ pathname: "(tabs)/" + item.route });
      });
    };

    return (
      <View>
        <Pressable
          style={styles.item}
          onPress={setShipmentIdsHandler}
          disabled={item.isDisabled}
        >
          <Text style={styles.description}>{t(item.description)}</Text>
          {loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <Text style={styles.counter}>{item.counter}</Text>
          )}
        </Pressable>
      </View>
    );
  };
  // --- END: Data and handlers ------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <SearchInput style={styles.searchContainer}>
        <FlatList data={data} renderItem={renderItem} />
      </SearchInput>
    </SafeAreaView>
  );
}
