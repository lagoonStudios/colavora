import React, { useMemo, useState } from "react";
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

import { useStore } from "@stores/zustand";

import useEventsQueue from "@hooks/eventsQueue/eventsQueue";

import Button from "@atoms/Button";
import ButtonImage from "@atoms/ButtonImage";
import TextInput from "@molecules/TextInput";
import { ActivityIndicator, Text, View } from "@components/Themed";
import { ShipmentActionsButtonItem } from "@organisms/ShipmentActions/ShipmentAction.constants";
import { ShipmentDetailsTabsItem } from "@templates/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";

import { styles } from "./ShipmentActionsException.styles";
import {
  IOrderExceptionForm,
  IShipmentActionsException,
} from "./ShipmentActionsException.types";

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
  const [loading, setLoading] = useState(false);
  const selectedReason = methods.watch("reasonID");
  const photoImage = methods.watch("photoImage");
  const addtionalCommentt = methods.watch("comment");

  const { orderException } = useEventsQueue();
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.1,
      base64: true,
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
    if (shipmentID) {
      setLoading(true);
      setStateModal(t("MODAL.CREATING_EXCEPTION"));
      orderException({
        shipmentID,
        comment: data.comment,
        reasonID: String(data.reasonID),
        photoImage: photoImage?.base64?.replace("data:image/png;base64,", ""),
        commentCreatedDate: new Date().toISOString(),
        reasonCode: String(selectedReason),
      })
        .then((res) => {
          setSelectedTab(ShipmentDetailsTabsItem.COMMENTS);
          setStateModalVisible(false);
          setLoading(false);
        })
        .catch((error) => {
          setStateModalVisible(false);
          console.error(
            "🚀 ~ file: ShipmentActionsException.tsx:120 ~ error:",
            error
          );
          setLoading(false);
        });
    }
  };

  const onError: SubmitErrorHandler<IOrderExceptionForm> = (errors) =>
    console.error("🚀 ~ ShipmentActionsException ~ errors:", errors);

  // --- END: Data and handlers ------------------------------------------------
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
