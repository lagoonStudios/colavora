import React from "react";
import { Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

import { Text } from "@components/Themed";

import { styles } from "./DefaultCODLabels.styles";
import { IDefaultCODLabels } from "./DefaultCODLabels.types";

export default function DefaultCODLabels({
  onPressHandler,
  showDefaultLabel,
}: IDefaultCODLabels) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  if (!showDefaultLabel) return null;

  return (
    <>
      <Pressable style={styles.container} onPress={onPressHandler}>
        <FontAwesome
          name="dollar"
          color="black"
          size={15}
          style={{
            marginLeft: 1,
            borderWidth: 2,
            borderRadius: 20,
            height: 23,
            width: 23,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        />
        <Text style={styles.label} adjustsFontSizeToFit>
          {t("ACTIONS.DEAFULT_LABEL")}
        </Text>
      </Pressable>
      <Pressable style={styles.container} onPress={onPressHandler}>
        <FontAwesome6
          name="file-invoice-dollar"
          color="black"
          size={23}
          style={{
            marginLeft: 2,
            height: 23,
            width: 23,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        />
        <Text style={styles.label} adjustsFontSizeToFit>
          0.00
        </Text>
      </Pressable>
    </>
  );
}
