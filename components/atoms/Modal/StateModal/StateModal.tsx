import React from "react";
import { ActivityIndicator, Text, View } from "@components/Themed";
import { Modal } from "react-native";
import { useTranslation } from "react-i18next";
import { useStore } from "@stores/zustand";
import { styles } from "./StateModal.styles";

export default function StateModal() {
  // --- Hooks -----------------------------------------------------------------
  const {
    modal: { message, visible },
    setVisible,
  } = useStore();
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={setVisible}
    >
      <View style={styles.viewContainer}>
        <View style={styles.view}>
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color="#0075CF"
          />
          <Text>{t(message)}</Text>
        </View>
      </View>
    </Modal>
  );
}
