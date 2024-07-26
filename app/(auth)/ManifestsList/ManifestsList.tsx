import React from "react";
import { FlatList, Pressable } from "react-native";

import ManifestListItem from "@molecules/ManifestListItem";
import { ActivityIndicator, View } from "@components/Themed";
import { ManifestListItemProps } from "@molecules/ManifestListItem/ManifestListItem.types";

import { styles } from "./ManifestsList.styles";

import { useManifestsListData } from "./ManifestsList.functions";
import PageHeader from "@molecules/PageHeader/PageHeader";
import { useTranslation } from "react-i18next";

export default function ManifestsList() {
  // --- Hooks -----------------------------------------------------------------
  const { data, loading } = useManifestsListData();
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: ManifestListItemProps }) => (
    <Pressable>
      <ManifestListItem code={item.code} date={item.date} count={item.count} />
    </Pressable>
  );
  // --- END: Data and handlers ------------------------------------------------
  return (
    <View style={styles.container}>
      <PageHeader
        title={`${t("MANIFESTS.MANIFESTS")} ${data.length ? `(${data.length})` : ""}`}
      />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList data={data} renderItem={renderItem} />
        )}
      </View>
    </View>
  );
}
