/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useMemo, useReducer } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Signature from "@atoms/Signature";

import TextInput from "@molecules/TextInput";
import SaveButton from "@molecules/SaveButton";
import { Text, View } from "@components/Themed";

import { styles } from "./ShipmentActionsComplete.styles";
import { IShipmentActionsComplete } from "./ShipmentActionsComplete.types";
import { FormProvider, useForm } from "react-hook-form";
import ButtonImage from "@atoms/ButtonImage";
import DefaultCODLabels from "@atoms/DefaultCODLabels";
import CODComponet from "@atoms/CODComponet";
import Colors from "@constants/Colors";
import CODSelected from "@atoms/CODSelected";
export default function ShipmentActionsComplete() {
  // --- Local state -----------------------------------------------------------
  const [showModal, setModal] = useReducer((e) => !e, false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { ...methods } = useForm<IShipmentActionsComplete>({
    defaultValues: { podName: undefined, cods: [] },
  });
  const photoImage = methods.watch("photoImage");
  const codsSelected = methods.watch("cods");
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onPressDeafultLabels = () => setModal();

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      quality: 0.1,
    });

    if (!result.canceled) methods.setValue("photoImage", result.assets[0]);
  };

  const handleOK = (signature: string) => {
    const path = FileSystem.cacheDirectory + "sign.png";
    FileSystem.writeAsStringAsync(
      path,
      signature.replace("data:image/png;base64,", ""),
      { encoding: FileSystem.EncodingType.Base64 },
    )
      .then(() => FileSystem.getInfoAsync(path))
      .then((info) => methods.setValue("signatureImage", info.uri))
      .catch(console.error);
  };

  const addCOD = (codTypeID: number, codAmount = 0, codCheck = "") => {
    methods.setValue("cods", [
      ...codsSelected,
      { codAmount, codCheck, codTypeID, createdSource: codCheck },
    ]);
  };

  const showDefaultLabel = useMemo(
    () => codsSelected?.length === 0,
    [codsSelected?.length],
  );

  // --- END: Data and handlers ------------------------------------------------

  return (
    <FormProvider {...methods}>
      <View style={styles.providerContainer}>
        <Text style={styles.completeTitle}>{t("ACTIONS.ORDERS_COMPLETE")}</Text>
        <View style={styles.formContainer}>
          <TextInput
            name="podName"
            clearTextOnFocus={false}
            inputMode="text"
            placeholder={`${t("ACTIONS.POD_NAME")}`}
            optionalFirstComponent={
              <AntDesign
                name="user"
                color="black"
                size={20}
                style={{ marginLeft: 3 }}
              />
            }
            rules={{
              required: t("VALIDATIONS.REQUIRED"),
            }}
            style={styles.textInput}
            backgroundColorContainer={Colors.dark.gray.tint}
            backgroundColorInput="transparent"
          />
          <ButtonImage pickImage={pickImage} photoImage={photoImage} />
          <DefaultCODLabels
            onPressHandler={onPressDeafultLabels}
            showDefaultLabel={showDefaultLabel}
          />
          <CODComponet
            visible={showModal}
            setVisible={setModal}
            addCOD={addCOD}
          />
          <CODSelected codsSelected={codsSelected} setVisible={setModal} />
          <Signature handleOK={handleOK} />
        </View>
        <View style={styles.saveButtonContainer}>
          <SaveButton style={styles.saveButton} />
        </View>
      </View>
    </FormProvider>
  );
}
