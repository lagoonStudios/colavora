import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert } from "react-native";
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import TextInput from "@molecules/TextInput";
import { useAddComment } from "@hooks/queries";
import SaveButton from "@molecules/SaveButton";
import { Text, View } from "@components/Themed";
import { mockUserID } from "@constants/Constants";

import { IAddComment, CommentForm } from "./AddComment.types";
import { styles } from "./AddComment.styles";
import { useStore } from "@stores/zustand";
export default function AddComment({ refetch }: IAddComment) {
  // --- Hooks -----------------------------------------------------
  const { t } = useTranslation();
  const { mutate, isSuccess, isPending: loading } = useAddComment();
  const { ...methods } = useForm<CommentForm>({
    defaultValues: { comment: "" },
  });
  const {
    shipment: { shipmentID, companyID },
  } = useStore();
  // --- END: Hooks ------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onSubmit: SubmitHandler<CommentForm> = (data) => {
    if (data.comment.trim() === "") {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    mutate({
      companyID: Number(companyID),
      userID: mockUserID,
      shipmentID,
      comment: data.comment,
    });
  };

  const onError: SubmitErrorHandler<CommentForm> = (errors) =>
    console.log(errors);
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  useEffect(() => {
    if (isSuccess) {
      refetch?.();
      methods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, refetch]);
  // --- END: Side effects -----------------------------------------------------

  return (
    <FormProvider {...methods}>
      <View style={styles.providerContainer}>
        <Text style={styles.noteTitle}>{t("COMMENTS.COMMENTS")}</Text>
        <View>
          <TextInput
            clearTextOnFocus={false}
            inputMode="text"
            multiline
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
