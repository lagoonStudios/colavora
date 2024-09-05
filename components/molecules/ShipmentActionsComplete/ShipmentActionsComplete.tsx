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
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";

import Colors from "@constants/Colors";
import Signature from "@atoms/Signature";
import ButtonImage from "@atoms/ButtonImage";
import CODSelected from "@atoms/CODSelected";
import TextInput from "@molecules/TextInput";
import CODComponet from "@atoms/CODComponet";
import { Text, View } from "@components/Themed";
import DefaultCODLabels from "@atoms/DefaultCODLabels";

import { useStore } from "@stores/zustand";
import { useSendCODs, useCompleteOrder } from "@hooks/index";

import { styles } from "./ShipmentActionsComplete.styles";
import { IShipmentActionsComplete } from "./ShipmentActionsComplete.types";
import { defaultFieldValues as defaultValues } from "./ShipmentActionsComplete.constants";
import { IShipmentActionsException } from "@molecules/ShipmentActionsException/ShipmentActionsException.types";
import { ShipmentDetailsTabsItem } from "@templates/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";
import Button from "@atoms/Button";
import { ShipmentActionsButtonItem } from "@organisms/ShipmentActions/ShipmentAction.constants";
import { updateShipmentStatus } from "@hooks/SQLite";
import { ShipmentStatus } from "@constants/types/shipments";
import { useRouter } from "expo-router";
import Toast from "react-native-root-toast";
export default function ShipmentActionsComplete({
  setOption,
  setSelectedTab,
}: IShipmentActionsException) {
  // --- Refs ------------------------------------------------------------------
  const ref = useRef<SignatureViewRef>(null);
  // --- END: Refs -------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const [showModal, setModal] = useReducer((e) => !e, false);
  const [noSelectCOD, setCondition] = useState<boolean>(false);
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const router = useRouter();
  const {
    shipment: { shipmentID, barcode, companyID },
    setModal: setStateModal,
    setVisible,
    user,
    setSyncing,
  } = useStore();
  const { ...methods } = useForm<IShipmentActionsComplete>({
    defaultValues,
  });

  const { t } = useTranslation();
  const { mutate, status: statusSendCODs } = useSendCODs();
  const { mutate: completeOrder, status: completeOrderStatus } =
    useCompleteOrder();

  const podName = methods.watch("podName");
  const comment = methods.watch("comment");
  const codsSelected = methods.watch("cods");
  const photoImage = methods.watch("photoImage");
  const signatureImage = methods.watch("signatureImage");
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onPressDeafultLabels = () => setModal();

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
      signature.replace("data:image/png;base64,", "")
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
    [codsSelected?.length]
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
        shipmentID,
        companyID,
        userID: user?.userID,
      }));

      mutate(completeCODs);
    } else setCondition(true);
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
        podName,
        comment,
        companyID,
        shipmentID,
        signatureImage,
        userID: user?.userID,
        photoImage: photoImage?.base64?.replace("data:image/png;base64", ""),
      });

    if (statusSendCODs === "error") setVisible(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codsSelected?.length, noSelectCOD, statusSendCODs]);

  useEffect(() => {
    if (completeOrderStatus === "error") {
      Toast.show(t("ACTIONS.COMPLETE_ORDER_FAIL"));
      setVisible(false);
    }

    if (completeOrderStatus === "success") {
      const setDefaultState = () => {
        Toast.show(t("ACTIONS.ORDER_COMPLETED"));
        onClear();
        methods.reset();
        setVisible(false);
        setCondition(false);
        setSelectedTab(ShipmentDetailsTabsItem.DETAILS);
      };
      setSyncing(true);
      if (shipmentID) {
        updateShipmentStatus({
          shipmentId: shipmentID,
          status: ShipmentStatus.COMPLETED,
          isSync: true,
        })
          .then(() => {
            setDefaultState();
            setSyncing(false);
            router.replace("/");
            console.log("UPDATED SHIPMENT LOCALLY");
          })
          .catch((error) => {
            console.error(
              "🚀 ~ file: ShipmentActionsComplete.tsx:179 ~ updateShipmentStatus ~ error:",
              error
            );
            setDefaultState();
          });
      } else {
        setDefaultState();
      }
    }
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
