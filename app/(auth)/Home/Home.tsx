import React from "react";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable } from "react-native";

import styles from "./Home.styles";
import { HomeItem } from "./Home.types";
import { useCODData, useHomeData, useReasonsData } from "./Home.functions";
import { SafeAreaView } from "@atoms/SafeAreaView";
import { ActivityIndicator, Text } from "@components/Themed";
import { useStore } from "@stores/zustand";

export default function Home() {
  // --- Hooks -----------------------------------------------------------------
  useCODData();
  useReasonsData();

  const { t } = useTranslation();
  const { addManifestIds } = useStore();
  const { data, loading } = useHomeData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: HomeItem }) => {
    const setManifestIdsHandler = () => {
      if (item?.data) addManifestIds(item.data);
    };

    return (
      <Link href={"(tabs)/" + item.route} asChild disabled={item.isDisabled}>
        <Pressable style={styles.item} onPress={setManifestIdsHandler}>
          <Text style={styles.description}>{t(item.description)}</Text>
          {loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <Text style={styles.counter}>{item.counter}</Text>
          )}
        </Pressable>
      </Link>
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
