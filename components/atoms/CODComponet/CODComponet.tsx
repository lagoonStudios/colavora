import React, { useMemo, useState } from "react";
import { Alert, Keyboard, Modal, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

import { Text, View } from "@components/Themed";
import { useStore } from "@stores/zustand";

import { ICODComponet } from "./CODComponet.types";
import Colors from "@constants/Colors";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import TextInput from "@molecules/TextInput";
import { styles } from "./CODComponent.styles";
import { defaultCODSelected } from "./CODComponet.constants";

export default function CODComponet({
  setVisible,
  visible,
  addCOD,
}: ICODComponet) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { CODs } = useStore();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [cod, setCod] = useState<{
    codTypeID?: number;
    codAmount?: number;
    codCheck?: string;
  }>(defaultCODSelected);
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const addCodHandler = () => {
    Keyboard.dismiss();

    if (!cod?.codTypeID) {
      Alert.alert("Error", "Please select COD type");
      return;
    }

    if (!cod?.codAmount) {
      Alert.alert("Error", "Please add amount");
      return;
    }

    addCOD(cod.codTypeID, cod?.codAmount, cod?.codCheck);
    setCod(defaultCODSelected);
    setVisible();
  };

  const CODItems = useMemo(
    () =>
      CODs?.sort((a, b) => a.codTypeID - b.codTypeID)?.map(
        ({ codTypeID: value, codType: label }) => (
          <Picker.Item
            label={`${value} - ${label}`}
            value={value}
            key={`picker-value-${value}`}
          />
        ),
      ),
    [CODs],
  );
  // --- END: Data and handlers ------------------------------------------------
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={setVisible}
    >
      <View style={styles.viewContainer}>
        <View style={styles.view}>
          <Text style={styles.addCOD}>{t("ACTIONS.ADD_COD")}</Text>
          <Picker
            selectedValue={cod?.codTypeID}
            mode="dropdown"
            onValueChange={(itemValue) =>
              setCod((prev) => ({
                ...prev,
                codTypeID: itemValue,
              }))
            }
            style={styles.picker}
          >
            {CODItems}
          </Picker>
          <TextInput
            name="codCheck"
            clearTextOnFocus={false}
            inputMode="text"
            placeholder={`${t("ACTIONS.DOCUMENT_NUMBER")}`}
            optionalFirstComponent={
              <FontAwesome
                name="dollar"
                color="black"
                size={15}
                style={styles.icon}
              />
            }
            backgroundColorContainer={Colors.dark.gray.tint}
            backgroundColorInput="transparent"
            style={styles.textInput}
            onChangeText={(itemValue) =>
              setCod((prev) => ({
                ...prev,
                codCheck: itemValue,
              }))
            }
          />
          <TextInput
            name="codAmount"
            clearTextOnFocus={false}
            inputMode="numeric"
            placeholder="0.00"
            optionalFirstComponent={
              <FontAwesome6
                name="file-invoice-dollar"
                color="black"
                size={23}
                style={styles.iconSecondary}
              />
            }
            backgroundColorContainer={Colors.dark.gray.tint}
            backgroundColorInput="transparent"
            style={styles.textInput}
            onChangeText={(itemValue) =>
              setCod((prev) => ({
                ...prev,
                codAmount: Number(itemValue),
              }))
            }
          />
          <View style={styles.buttonContainer}>
            <Pressable onPress={setVisible}>
              <Text style={styles.cancelButton}>{t("ACTIONS.CANCEL")}</Text>
            </Pressable>
            <Pressable onPress={addCodHandler}>
              <Text style={styles.addButton}>{t("ACTIONS.ADD")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
