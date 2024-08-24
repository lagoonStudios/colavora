import React, { useMemo, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

import SaveButton from "@molecules/SaveButton";
import TextInput from "@molecules/TextInput";

import { useStore } from "@stores/zustand";
import { useOrderException, useAddComment } from "@hooks/queries";
import { ActivityIndicator, Text, View } from "@components/Themed";
import { ShipmentDetailsTabsItem } from "@templates/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";

import { styles } from "./ShipmentActionsException.styles";
import {
  IOrderExceptionForm,
  IShipmentActionsException,
} from "./ShipmentActionsException.types";
import ButtonImage from "@atoms/ButtonImage";
export default function ShipmentActionsException({
  setSelectedTab,
}: IShipmentActionsException) {
  // --- Hooks -----------------------------------------------------------------
  const {
    shipment: { shipmentID, companyID },
    reasons,
    driver,
    setModal: setStateModal,
    setVisible: setStateModalVisible,
  } = useStore();
  const { t } = useTranslation();
  const { ...methods } = useForm<IOrderExceptionForm>({
    defaultValues: { comment: "", reasonID: -1 },
  });

  const { mutate, isSuccess, isPending: loading, error } = useOrderException();
  const { mutate: addComment, isSuccess: isSuccessAddComment } =
    useAddComment();

  const selectedReason = methods.watch("reasonID");
  const photoImage = methods.watch("photoImage");
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.1,
    });

    if (!result.canceled) methods.setValue("photoImage", result.assets[0]);
  };  

  const selectedReasonLabel = useMemo(() => {
    if (selectedReason)
      return reasons?.find(({ reasonID }) => reasonID === selectedReason)
        ?.reasonCodeDesc;
  }, [reasons, selectedReason]);

  const reasonItems = useMemo(
    () =>
      reasons
        ?.sort((a, b) => a.reasonID - b.reasonID)
        ?.map(({ reasonID: value, reasonCodeDesc: label }) => (
          <Picker.Item
            label={label}
            value={value}
            key={`picker-value-${value}`}
          />
        )),
    [reasons]
  );

  const onSubmit: SubmitHandler<IOrderExceptionForm> = (data) => {
    if (data?.comment?.trim() === "") {
      Alert.alert("Error", "Please enter a comment");
      return;
    }
    if (!data?.reasonID || data?.reasonID === -1) {
      Alert.alert("Error", "Please select a reason");
      return;
    }
    setStateModal(t("MODAL.CEATING_EXCEPTION"));
    mutate({
      companyID: companyID,
      userID: driver?.userID,
      shipmentID,
      comment: data.comment,
      reasonID: data.reasonID,
      photoImage: photoImage?.base64?.replace("data:image/png;base64,", "")
    });
  };

  const onError: SubmitErrorHandler<IOrderExceptionForm> = (errors) =>
    console.error("🚀 ~ ShipmentActionsException ~ errors:", errors);

  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isSuccess)
      addComment({
        companyID: companyID,
        userID: driver?.userID,
        shipmentID,
        comment: `Order Exception - ${selectedReasonLabel}`,
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      console.error("🚀 ShipmentActionsException ~ error: ", error);
      setStateModalVisible(false);
    }
  }, [error]);

  useEffect(() => {
    if (isSuccessAddComment) {
      setStateModalVisible(false);
      setSelectedTab(ShipmentDetailsTabsItem.COMMENTS);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessAddComment]);
  // --- END: Side effects -----------------------------------------------------
  return (
    <FormProvider {...methods}>
      <View style={styles.providerContainer}>
        <Text style={styles.noteTitle}>{t("ACTIONS.ORDERS_EXCEPTION")}</Text>
        <View style={styles.containerInput}>
          <Picker
            style={styles.pickerContainer}
            selectedValue={selectedReason}
            mode="dropdown"
            onValueChange={(itemValue) =>
              methods.setValue("reasonID", itemValue)
            }
          >
            <Picker.Item label={t("COMMON.SELECT_A_VALUE")} value={-1} />
            {reasonItems}
          </Picker>
          <TextInput
            clearTextOnFocus={false}
            inputMode="text"
            multiline
            placeholder={`${t("ACTIONS.PLACEHOLDER")}`}
            numberOfLines={3}
            style={styles.commnetInput}
            name="comment"
            rules={{
              required: t("VALIDATIONS.EMPTY"),
            }}
          />
          <ButtonImage pickImage={pickImage} photoImage={photoImage} />
        </View>
        <View style={styles.saveButtonContainer}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <SaveButton
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onPress={methods.handleSubmit(onSubmit, onError)}
              style={styles.saveButton}
            />
          )}
        </View>
      </View>
    </FormProvider>
  );
}
