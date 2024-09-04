import React from "react";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { FlatList, Pressable } from "react-native";

import styles from "./Home.styles";
import { HomeItem } from "./Home.types";
import { useHomeData } from "./Home.functions";
import SearchInput from "@organisms/SearchInput";
import { SafeAreaView } from "@atoms/SafeAreaView";
import { ActivityIndicator, Text } from "@components/Themed";

export default function Home() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { data, loading } = useHomeData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: HomeItem }) => {
    return (
      <Link href={"(tabs)/" + item.route} asChild disabled={item.isDisabled}>
        <Pressable style={styles.item}>
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
