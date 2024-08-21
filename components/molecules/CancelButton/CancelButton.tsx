import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleProp, ViewStyle } from "react-native";

import { Text } from "@components/Themed";
import Colors from "@constants/Colors";

export default function CancelButton({
  style,
  onClear,
}: {
  style: StyleProp<ViewStyle>;
  onClear: () => void;
}) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <Pressable style={style} onPress={onClear}>
      <Text
        style={{
          color: Colors.light.text.contrast,
        }}
      >
        {t("ACTIONS.CLEAR")}
      </Text>
    </Pressable>
  );
}
