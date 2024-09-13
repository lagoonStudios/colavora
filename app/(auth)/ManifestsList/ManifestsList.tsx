import React from "react";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";

import PageHeader from "@molecules/PageHeader/PageHeader";
import { ActivityIndicator, View, Text } from "@components/Themed";
import { useStore } from "@stores/zustand";

import { styles } from "./ManifestsList.styles";
import ManifestListItem from "@molecules/ManifestListItem";
import { useManifestsListData } from "./ManifestsList.functions";
import { ManifestListItemProps } from "@molecules/ManifestListItem/ManifestListItem.types";

export default function ManifestsList() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { manifestIds } = useStore();
  const { data, loading } = useManifestsListData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: ManifestListItemProps }) => (
    <ManifestListItem {...item} />
  );
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
      <PageHeader
        title={`${t("MANIFESTS.MANIFESTS")} (${manifestIds?.length ?? ""})`}
      />
      <View style={styles.content}>
        {loading && <ActivityIndicator />}
        {!loading && <FlatList data={data} renderItem={renderItem} />}
        {data.length === 0 && (
          <View style={{ flex: 1 }}>
            <Text style={{ textAlign: "center" }}>
              {t("MANIFESTS.NO_MANIFESTS")}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
