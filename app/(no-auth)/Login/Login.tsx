import React from "react";
import { useTranslation } from "react-i18next";
import {
  useForm,
  SubmitHandler,
  FormProvider,
  SubmitErrorHandler,
} from "react-hook-form";

import { styles } from "./Login.styles";

import CompanyLogo from "@atoms/CompanyLogo";

import TextInput from "@molecules/TextInput";
import { ActivityIndicator, Text, View } from "@components/Themed";
import LoginButton from "@molecules/LoginButton";
import { EmailRegex } from "@constants/Constants";
import { Alert } from "react-native";
import useAuth from "@hooks/Auth";
import { SafeAreaView } from "@atoms/SafeAreaView";

interface LoginForm {
  userName: string;
  password: string;
}

export default function Login() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { ...methods } = useForm<LoginForm>();
  const { login, loading } = useAuth();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onSubmit: SubmitHandler<LoginForm> = (data) => {
    if (data.userName.trim() === "") {
      Alert.alert("Error", "Please enter a username");
      return;
    }
    if (data.password.trim() === "") {
      Alert.alert("Error", "Please enter a password");
      return;
    }
    login({ userName: data.userName, password: data.password });
  };

  const onError: SubmitErrorHandler<LoginForm> = (errors) => {
    return console.log(errors);
  };
  // --- END: Data and handlers ------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <CompanyLogo />
      <View style={styles.formContainer}>
        <FormProvider {...methods}>
          <TextInput
            clearTextOnFocus={false}
            inputMode="email"
            label={t("USERNAME")}
            name="userName"
            rules={{
              required: t("VALIDATIONS.REQUIRED"),
              pattern: {
                value: EmailRegex,
                message: t("VALIDATIONS.EMAIL"),
              },
            }}
          />

          <TextInput
            clearTextOnFocus={false}
            inputMode="text"
            label={t("PASSWORD")}
            name="password"
            secureTextEntry={true}
            rules={{
              required: t("VALIDATIONS.REQUIRED"),
            }}
          />
        </FormProvider>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <LoginButton onPress={methods.handleSubmit(onSubmit, onError)} />
      )}

      <Text>{t("POWERED_BY")}</Text>
    </SafeAreaView>
  );
}
