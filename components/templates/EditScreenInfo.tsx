import React from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "../Themed";

import { useDefaultLanguage } from "@/hooks";
import { storeLanguageData } from "@/utils";

export default function EditScreenInfo() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const languages = [
    { label: "English", value: "en" },
    { label: "Español", value: "es" },
    // Add more languages as needed
  ];
  // --- END: Local state ------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Redux -----------------------------------------------------------------
  // --- END: Redux ------------------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // Set a defalut language stored in the async storage
  useDefaultLanguage();
  // --- END: Side effects -----------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text
          style={styles.getStartedText}
          darkColor="rgba(255,255,255,0.05)"
          lightColor="rgba(0,0,0,0.05)"
        >
          {t("DEFAULT")}
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <FlatList
          data={languages}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                i18next.changeLanguage(item.value);
                storeLanguageData(item.value);
              }}
              style={styles.language}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: "center",
    color: "black",
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
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
