import React, { useMemo, useEffect } from "react";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

import SaveButton from "@molecules/SaveButton";
import TextInput from "@molecules/TextInput";
import { styles } from "./ShipmentActionsException.styles";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ActivityIndicator, Text, View } from "@components/Themed";
import { Alert } from "react-native";
import { useStore } from "@stores/zustand";
import { IOrderExceptionForm } from "./ShipmentActionsException.types";
import { useOrderException } from "@hooks/queries";
import { mockUserID } from "@constants/Constants";
export default function ShipmentActionsException() {
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
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  const selectedReason = methods.watch("reasonID");
  // --- END: Local state ------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const reasonItems = useMemo(
    () =>
      reasons
        ?.sort((a, b) => a.reasonID - b.reasonID)
        ?.map(({ reasonID: value, reasonCodeDesc: label }) => ({
          value,
          label,
        })),
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
    console.log(errors);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isSuccess) {
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
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
            {reasonItems?.map(({ label, value }) => (
              <Picker.Item
                label={label}
                value={value}
                key={`picker-value-${value}`}
              />
            ))}
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
