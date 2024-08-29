import React from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet } from "react-native";

import { Text, View } from "../Themed";

import { storeLanguageData } from "@/utils";
import Button from "@atoms/Button";
import { useThemeColor } from "@components/Themed";

export default function EditScreenInfo() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const them = useThemeColor({}, "primary");
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const languages = [
    { label: t("ENGLISH"), value: "en" },
    { label: t("SPANISH"), value: "es" },
    // Add more languages as needed
  ];
  // --- END: Local state ------------------------------------------------------
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("CHANGE_LANGUAGE")}</Text>
      <FlatList
        data={languages}
        renderItem={({ item }) => (
          <Button
            label={item.label}
            onPress={() => {
              i18next.changeLanguage(item.value);
              storeLanguageData(item.value);
            }}
            style={[styles.language, { backgroundColor: them.default }]}
            labelStyle={{ color: them.contrast }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 18,
  },
  language: {
    padding: 10,
    backgroundColor: "gray",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    color: "black",
    marginVertical: 10,
  },
});
