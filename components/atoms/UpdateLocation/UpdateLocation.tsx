/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { useTranslation } from "react-i18next";

import { Text, View } from "@components/Themed";

import { styles } from "./UpdateLocation.styles";
import Checkbox from "expo-checkbox";
import { IUpdateLocation } from "./UpdateLocation.types";
export default function UpdateLocation({
  isChecked,
  onChange,
}: IUpdateLocation) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Checkbox value={isChecked} onValueChange={onChange} />
      <Text style={styles.title}>{t("ACTIONS.UPDATING_LOCATION")}</Text>
    </View>
  );
}
