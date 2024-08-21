import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, PressableProps } from "react-native";

import { Text } from "@components/Themed";
import Colors from "@constants/Colors";

export default function SaveButton(props: PressableProps) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <Pressable {...props}>
      <Text style={{ color: Colors.light.text.contrast }}>
        {t("COMMENTS.SAVE")}
      </Text>
    </Pressable>
  );
}
