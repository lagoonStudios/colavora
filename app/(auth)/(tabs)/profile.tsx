import React from "react";
import { StyleSheet } from "react-native";

import { Text, View } from "@components/Themed";
import { SafeAreaView } from "@atoms/SafeAreaView";
import EditScreenInfo from "@templates/EditScreenInfo";
import { useTranslation } from "react-i18next";
import PageHeader from "@molecules/PageHeader/PageHeader";

import SyncButton from "@molecules/SyncButton";

export default function ProfileScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <PageHeader title={t("PROFILE")} />
      <View style={styles.buttonsContainer}>
        <EditScreenInfo />
        <SyncButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonsContainer: {
    padding: 20,
    justifyContent: "space-between",
    gap: 10,
    flex: 1,
  },
});
