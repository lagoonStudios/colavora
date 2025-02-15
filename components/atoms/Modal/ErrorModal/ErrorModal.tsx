import React, { useMemo, useState } from "react";
import { Text, View } from "@components/Themed";
import { Modal, Pressable, ScrollView, Image } from "react-native";
import { useStore } from "@stores/zustand";
import { styles } from "./ErrorModal.styles";

export default function ErrorModal() {
  // --- Hooks -----------------------------------------------------------------
  const {
    errorModal: { messages, visible },
    hideModalErrorModal,
  } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [index, setIndex] = useState(0);
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onRequestClose = () => hideModalErrorModal({});

  const message = useMemo(() => messages[index], [index, messages]);
  const totalMessages = useMemo(() => messages.length, [messages]);
  // --- END: Data and handlers ------------------------------------------------

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onRequestClose}
      onDismiss={onRequestClose}
    >
      <View style={styles.viewContainer}>
        <View style={styles.iconContainer}>
          <Image
            source={require("@assets/images/alert.png")}
            style={{
              width: 60,
              height: 60,
              maxHeight: 60,
              maxWidth: 60,
            }}
            height={60}
            width={60}
            resizeMode="cover"
          />
        </View>
        <View style={styles.view}>
          <Text style={styles.textError}>
            Error {index + 1}/{totalMessages}
          </Text>
          <View>
            <View style={styles.viewDataContainer}>
              <Pressable
                onPress={() => setIndex(index !== 0 ? index - 1 : 0)}
                style={styles.pressableButton}
              >
                <Text
                  style={{
                    ...styles.textPressable,
                    color: index === 0 ? "gray" : "red",
                    display: totalMessages === 1 ? "none" : "flex",
                  }}
                >{`<`}</Text>
              </Pressable>
              <ScrollView>
                <View style={styles.scrollContainer}>
                  <View style={styles.textView}>
                    <Text style={styles.text}>{message}</Text>
                  </View>
                </View>
              </ScrollView>
              <Pressable
                onPress={() =>
                  setIndex(
                    index < totalMessages - 1 ? index + 1 : totalMessages - 1,
                  )
                }
                style={styles.pressableButton}
              >
                <Text
                  style={{
                    ...styles.textPressable,
                    color: index === totalMessages - 1 ? "gray" : "red",
                    display: totalMessages === 1 ? "none" : "flex",
                  }}
                >{`>`}</Text>
              </Pressable>
            </View>
            <View style={styles.closeContainer}>
              <Pressable onPress={onRequestClose}>
                <Text style={styles.closeText}>close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
