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
import { Text, View } from "@components/Themed";
import LoginButton from "@molecules/LoginButton";

interface LoginForm {
  userName: string;
  password: string;
}

export default function Login() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  const { ...methods } = useForm<LoginForm>();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const onSubmit: SubmitHandler<LoginForm> = (data) => console.log({ data });
  const onError: SubmitErrorHandler<LoginForm> = (errors, e) => {
    return console.log(errors);
  };
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
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
      {/* <Button label="test" type="submit" /> */}
      <LoginButton onPress={methods.handleSubmit(onSubmit, onError)} />
      <Text>{t("POWERED_BY")}</Text>
    </View>
  );
}
