import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { View, Text, useThemeColor } from "@components/Themed";
import { IShipmentActionsDefault } from "./ShipmentActionsDefault.types";
import { ShipmentActionsButtonItem } from "@organisms/ShipmentActions/ShipmentAction.constants";
import { styles } from "./ShipmentActionsDefault.style";
import { Pressable } from "react-native";

export default function ShipmentActionsDefault({
  setOption,
}: IShipmentActionsDefault) {
  const { t } = useTranslation();
  const { default: activeBackgroundColor, contrast: activeTextColor } =
    useThemeColor({}, "primary");

  const exceptionHandler = useCallback(
    () => setOption(ShipmentActionsButtonItem.EXCEPTION),
    [setOption],
  );
  const completeHandler = useCallback(
    () => setOption(ShipmentActionsButtonItem.COMPLETE),
    [setOption],
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={exceptionHandler}
        style={{ ...styles.item, backgroundColor: activeBackgroundColor }}
      >
        <Text
          style={{ ...styles.label, color: activeTextColor }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {t("ACTIONS.ORDERS_EXCEPTION")}
        </Text>
      </Pressable>
      <Pressable
        onPress={completeHandler}
        style={{ ...styles.item, backgroundColor: activeBackgroundColor }}
      >
        <Text
          style={{ ...styles.label, color: activeTextColor }}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {t("ACTIONS.ORDERS_COMPLETE")}
        </Text>
      </Pressable>
    </View>
  );
}
