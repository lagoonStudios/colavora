import React from "react";
import { FlatList, Pressable } from "react-native";

import { Text } from "@components/Themed";
import ManifestListItem from "@molecules/ManifestListItem";
import { ManifestListItemProps } from "@molecules/ManifestListItem/ManifestListItem.types";

import { styles } from "./ManifestsList.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useManifestsListData } from "./ManifestsList.functions";

export default function ManifestsList() {
  // --- Hooks -----------------------------------------------------------------
  const { data, loading } = useManifestsListData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: ManifestListItemProps }) => (
    <Pressable>
      <ManifestListItem code={item.code} date={item.date} count={item.count} />
    </Pressable>
  );
  // --- END: Data and handlers ------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList data={data} renderItem={renderItem} />
      )}
    </SafeAreaView>
  );
}
