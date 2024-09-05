import React, { useMemo, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { Alert, Pressable } from "react-native";
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
import ArrowLeft from "@atoms/ArrowLeft";
import { ShipmentActionsButtonItem } from "@organisms/ShipmentActions/ShipmentAction.constants";
import Button from "@atoms/Button";
import { insertMultipleComments } from "@hooks/SQLite/queries/comments.local.queries";
import { fetchCommentsByIdData } from "@services/custom-api";
export default function ShipmentActionsException({
  setSelectedTab,
  setOption,
}: IShipmentActionsException) {
  // --- Hooks -----------------------------------------------------------------
  const {
    shipment: { shipmentID },
    reasons,
    user,
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
  const addtionalCommentt = methods.watch("comment");
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
    setStateModal(t("MODAL.CREATING_EXCEPTION"));
    mutate({
      companyID: user?.companyID,
      userID: user?.userID,
      shipmentID,
      comment: data.comment,
      reasonID: data.reasonID,
      photoImage: photoImage?.base64?.replace("data:image/png;base64,", ""),
    });
  };

  const onError: SubmitErrorHandler<IOrderExceptionForm> = (errors) =>
    console.error("🚀 ~ ShipmentActionsException ~ errors:", errors);

  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isSuccess)
      addComment({
        companyID: user?.companyID,
        userID: user?.userID,
        shipmentID,
        comment: `Order Exception - ${selectedReasonLabel} - ${addtionalCommentt}`,
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
    if (isSuccessAddComment && shipmentID) {
      const getNewComments = async () => {
        const createdDate = new Date().toISOString();
        const comments = await fetchCommentsByIdData({ id: String(shipmentID) })

        if (comments.data) {
          const commentsToInsert = comments.data?.map((comment) => ({
            comment,
            createdDate,
            companyID: user?.companyID,
            shipmentID: shipmentID!
          }))

          insertMultipleComments(commentsToInsert).then(() => {
            setStateModalVisible(false);
            setSelectedTab(ShipmentDetailsTabsItem.COMMENTS);        
          })
        }
      }

      getNewComments();

    }

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
          <Button
            labelStyle={styles.backButtonLabel}
            label={t("COMMON.BACK")}
            onPress={() => setOption(ShipmentActionsButtonItem.DEFAULT)}
          />
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button
              label={t("COMMENTS.SAVE")}
              labelStyle={styles.saveButtonLabel}
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
