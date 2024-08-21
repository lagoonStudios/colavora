import React, { useMemo } from "react";
import { View, Text } from "@components/Themed";

import { ICODSelected } from "./CODSelected.types";
import { Pressable } from "react-native";
import { styles } from "./CODSelected.styles";
import { useStore } from "@stores/zustand";

export default function CODSelected({
  codsSelected,
  setVisible,
}: ICODSelected) {
  // --- Hooks -----------------------------------------------------------------
  const { CODs } = useStore();

  const items = useMemo(() => {
    const getType = (codTypeID: number) =>
      CODs?.find((COD) => COD.codTypeID === codTypeID)?.codType;

    return codsSelected?.map(({ codTypeID, codCheck, codAmount }, index) => (
      <View style={styles.viewItems} key={`cod-item-${index}`}>
        <Text style={styles.textItem}>
          {index + 1} {getType(codTypeID)}
        </Text>
        <Text style={styles.textItem}>{codAmount ? `(${codCheck})` : ""}</Text>
        <Text style={styles.textItem}>/ ${codAmount}</Text>
      </View>
    ));
  }, [CODs, codsSelected]);
  // --- END: Hooks ------------------------------------------------------------

  if (codsSelected?.length === 0) return null;

  return (
    <View style={styles.container}>
      <Pressable style={styles.addCOD} onPress={setVisible}>
        <Text style={styles.addCODText}>Add COD</Text>
      </Pressable>
      <View style={styles.viewItemsContainer}>{items}</View>
    </View>
  );
}
