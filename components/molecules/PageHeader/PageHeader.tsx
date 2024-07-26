import React from "react";
import { Pressable } from "react-native";
import { useNavigation } from "expo-router";

import ArrowLeft from "@atoms/ArrowLeft";
import { View, Text } from "@components/Themed";

import { styles } from "./PageHeader.styles";

export default function PageHeader(props: { title: string }) {
  const { title } = props;
  // --- Hooks -----------------------------------------------------------------
  const navigation = useNavigation();

  // --- END: Hooks ------------------------------------------------------------

  return (
    <View style={styles.header}>
      <Pressable style={styles.arrowBack} onPress={() => navigation.goBack()}>
        <ArrowLeft styles={styles.arrowBack} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
