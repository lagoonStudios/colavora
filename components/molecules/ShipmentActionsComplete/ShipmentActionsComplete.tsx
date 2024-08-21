/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Alert } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { SignatureViewRef } from "react-native-signature-canvas";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";

import Colors from "@constants/Colors";
import Signature from "@atoms/Signature";
import ButtonImage from "@atoms/ButtonImage";
import CODSelected from "@atoms/CODSelected";
import TextInput from "@molecules/TextInput";
import CODComponet from "@atoms/CODComponet";
import SaveButton from "@molecules/SaveButton";
import { Text, View } from "@components/Themed";
import CancelButton from "@molecules/CancelButton";
import DefaultCODLabels from "@atoms/DefaultCODLabels";

import { useStore } from "@stores/zustand";
import { useSendCODs, useCompleteOrder } from "@hooks/index";

import { styles } from "./ShipmentActionsComplete.styles";
import { IShipmentActionsComplete } from "./ShipmentActionsComplete.types";
import { defaultFieldValues as defaultValues } from "./ShipmentActionsComplete.constants";
export default function ShipmentActionsComplete() {
  // --- Refs ------------------------------------------------------------------
  const ref = useRef<SignatureViewRef>(null);
  // --- END: Refs -------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [showModal, setModal] = useReducer((e) => !e, false);
  const [noSelectCOD, setCodition] = useState<boolean>(false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const {
    shipment: { shipmentID, barcode, companyID },
    setModal: setStateModal,
    setVisible,
    driver,
  } = useStore();
  const { ...methods } = useForm<IShipmentActionsComplete>({
    defaultValues,
  });

  const { t } = useTranslation();
  const { mutate, status: statusSendCODs } = useSendCODs();
  const { mutate: completeOrder, status: completeOrderStatus } =
    useCompleteOrder();

  const podName = methods.watch("podName");
  const codsSelected = methods.watch("cods");
  const photoImage = methods.watch("photoImage");
  const signatureImage = methods.watch("signatureImage");
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onPressDeafultLabels = () => setModal();

  const onClear = () => ref?.current?.clearSignature();

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const onSubmit: SubmitHandler<IShipmentActionsComplete> = ({
    cods,
    signatureImage,
  }) => {
    if (!signatureImage) {
      Alert.alert("Error", "The signature is required");
      return;
    }

    setStateModal("MODAL.COMPLETING");

    if (cods?.length !== 0) {
      const completeCODs = cods?.map((cod) => ({
        ...cod,
        companyID: Number(companyID),
        shipmentID: shipmentID,
        userID: driver?.userID,
      }));

      mutate(completeCODs);
    } else setCodition(true);
  };

  const onError: SubmitErrorHandler<IShipmentActionsComplete> = (errors) =>
    console.error("🚀 ~ ShipmentActionsComplete ~ errors:", errors);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    const isCompleteWithOutCODsAllow =
      codsSelected?.length === 0 && noSelectCOD;

    if (statusSendCODs === "success" || isCompleteWithOutCODsAllow)
      completeOrder({
        barcode,
        signatureImage,
        podName,
        photoImage: photoImage?.uri,
        companyID: Number(companyID),
        shipmentID: shipmentID,
        userID: driver?.userID,
      });

    if (statusSendCODs === "error") setVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codsSelected?.length, noSelectCOD, statusSendCODs]);

  useEffect(() => {
    if (completeOrderStatus === "success") {
      console.log("Complete Order");
      setVisible(false);
      setCodition(false);
      methods.reset();
      onClear();
    }

    if (completeOrderStatus === "error") setVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completeOrderStatus]);
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
          <Signature handleOK={handleOK} refSignature={ref} />
        </View>
        <View style={styles.saveButtonContainer}>
          <CancelButton style={styles.cancelButton} onClear={onClear} />
          <SaveButton
            style={styles.saveButton}
            onPress={methods.handleSubmit(onSubmit, onError)}
          />
        </View>
      </View>
    </FormProvider>
  );
}
