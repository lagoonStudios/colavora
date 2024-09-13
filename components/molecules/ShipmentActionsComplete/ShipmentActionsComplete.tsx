/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { SignatureViewRef } from "react-native-signature-canvas";
import React, { useMemo, useReducer, useRef } from "react";

import Colors from "@constants/Colors";
import Signature from "@atoms/Signature";
import ButtonImage from "@atoms/ButtonImage";
import CODSelected from "@atoms/CODSelected";
import TextInput from "@molecules/TextInput";
import CODComponet from "@atoms/CODComponet";
import { Text, View } from "@components/Themed";
import DefaultCODLabels from "@atoms/DefaultCODLabels";

import { useStore } from "@stores/zustand";

import { styles } from "./ShipmentActionsComplete.styles";
import { IShipmentActionsComplete } from "./ShipmentActionsComplete.types";
import { defaultFieldValues as defaultValues } from "./ShipmentActionsComplete.constants";
import { IShipmentActionsException } from "@molecules/ShipmentActionsException/ShipmentActionsException.types";
import Button from "@atoms/Button";
import { ShipmentActionsButtonItem } from "@organisms/ShipmentActions/ShipmentAction.constants";
import { useRouter } from "expo-router";
import Toast from "react-native-root-toast";
import useEventsQueue from "@hooks/eventsQueue";
export default function ShipmentActionsComplete({
  setOption,
}: IShipmentActionsException) {
  // --- Refs ------------------------------------------------------------------
  const ref = useRef<SignatureViewRef>(null);
  // --- END: Refs -------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [showModal, setModal] = useReducer((e) => !e, false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const router = useRouter();
  const {
    shipment: { shipmentID, companyID },
    pieces,
    setModal: setStateModal,
    setVisible,
    user,
    setSyncing,
  } = useStore();
  const { ...methods } = useForm<IShipmentActionsComplete>({
    defaultValues,
  });

  const { completeOrder } = useEventsQueue();

  const { t } = useTranslation();

  const podName = methods.watch("podName");
  const comment = methods.watch("comment");
  const codsSelected = methods.watch("cods");
  const photoImage = methods.watch("photoImage");
  const signatureImage = methods.watch("signatureImage");
  const barcodes = pieces.map(({ barcode }) => barcode);
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onPressDefaultLabels = () => setModal();

  const onClear = () => {
    methods.setValue("signatureImage", "");
    return ref?.current?.clearSignature();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.1,
    });

    if (!result.canceled) methods.setValue("photoImage", result.assets[0]);
  };

  const handleOK = (signature: string) => {
    methods.setValue(
      "signatureImage",
      signature.replace("data:image/png;base64,", ""),
    );
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

  const onSubmit: SubmitHandler<IShipmentActionsComplete> = async ({
    cods,
    signatureImage,
  }) => {
    if (!signatureImage) {
      Alert.alert("Error", "The signature is required");
      return;
    }

    setStateModal("MODAL.COMPLETING");

    if (companyID && user?.userID && shipmentID) {
      const completeCODs = cods?.map((cod) => ({
        ...cod,
        shipmentID: shipmentID,
        companyID,
        userID: user?.userID,
      }));

      try {
        setSyncing(true);
        await completeOrder({
          userID: user.userID,
          companyID: companyID,
          shipmentID: shipmentID,
          barcodes,
          podName,
          comment,
          signatureImage,
          completeCODs,
          photoImage: photoImage?.base64?.replace("data:image/png;base64", ""),
        });
        router.replace("/");
        setVisible(false);
        setSyncing(false);
      } catch (error) {
        console.error(
          "🚀 ~ file: ShipmentActionsComplete.tsx:143 ~ error:",
          error,
        );
        setSyncing(false);
        setVisible(false);
      }
    }
  };

  const onError: SubmitErrorHandler<IShipmentActionsComplete> = (errors) => {
    console.error(
      "🚀 ~ file: ShipmentActionsComplete.tsx:144 ~ errors:",
      errors,
    );
    Toast.show(t("ERRORS.UNKNOWN"));
    return;
  };

  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // --- END: Side effects -----------------------------------------------------

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
          <TextInput
            name="comment"
            clearTextOnFocus={false}
            inputMode="text"
            placeholder={`${t("ACTIONS.PLACEHOLDER")}`}
            style={styles.commnetInput}
            backgroundColorContainer={Colors.dark.gray.tint}
            backgroundColorInput="transparent"
          />
          <ButtonImage pickImage={pickImage} photoImage={photoImage} />
          <DefaultCODLabels
            onPressHandler={onPressDefaultLabels}
            showDefaultLabel={showDefaultLabel}
          />
          <CODComponet
            visible={showModal}
            setVisible={setModal}
            addCOD={addCOD}
          />
          <CODSelected codsSelected={codsSelected} setVisible={setModal} />
          <Signature handleOK={handleOK} refSignature={ref} />
        </View>
        <View style={styles.saveButtonContainer}>
          <Button
            labelStyle={styles.backButtonLabel}
            label={t("COMMON.BACK")}
            onPress={() => setOption(ShipmentActionsButtonItem.DEFAULT)}
          />

          <Button
            disabled={!signatureImage}
            label={t("ACTIONS.CLEAR")}
            labelStyle={styles.cancelButtonLabel}
            onPress={onClear}
          />

          <Button
            label={t("COMMENTS.SAVE")}
            labelStyle={styles.saveButtonLabel}
            onPress={methods.handleSubmit(onSubmit, onError)}
            style={styles.saveButton}
          />
        </View>
      </View>
    </FormProvider>
  );
}
