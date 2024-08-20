import React, { useMemo, useEffect } from "react";
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
import { mockUserID } from "@constants/Constants";
import { useOrderException, useAddComment } from "@hooks/queries";
import { ActivityIndicator, Text, View } from "@components/Themed";
import { ShipmentDetailsTabsItem } from "@templates/ShipmentDetailsTabs/ShipmentDetailsTabs.constants";

import { styles } from "./ShipmentActionsException.styles";
import {
  IOrderExceptionForm,
  IShipmentActionsException,
} from "./ShipmentActionsException.types";
export default function ShipmentActionsException({
  setSelectedTab,
}: IShipmentActionsException) {
  // --- Hooks -----------------------------------------------------------------
  const {
    shipment: { shipmentID, companyID },
    reasons,
  } = useStore();
  const { t } = useTranslation();
  const { ...methods } = useForm<IOrderExceptionForm>({
    defaultValues: { comment: undefined, reasonID: undefined },
  });

  const { mutate, isSuccess, isPending: loading } = useOrderException();
  const { mutate: addComment, isSuccess: isSuccessAddComment } =
    useAddComment();

  const selectedReason = methods.watch("reasonID");
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
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
    [reasons],
  );

  const onSubmit: SubmitHandler<IOrderExceptionForm> = (data) => {
    if (data?.comment?.trim() === "") {
      Alert.alert("Error", "Please enter a comment");
      return;
    }
    if (!data?.reasonID) {
      Alert.alert("Error", "Please select a reason");
      return;
    }

    mutate({
      companyID: Number(companyID),
      userID: mockUserID,
      shipmentID,
      comment: data.comment,
      reasonID: data.reasonID,
    });
  };

  const onError: SubmitErrorHandler<IOrderExceptionForm> = (errors) =>
    console.error("🚀 ~ ShipmentActionsException ~ errors:", errors);

  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isSuccess)
      addComment({
        companyID: Number(companyID),
        userID: mockUserID,
        shipmentID,
        comment: `Order Exception - ${selectedReasonLabel}`,
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessAddComment) setSelectedTab(ShipmentDetailsTabsItem.COMMENTS);
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
