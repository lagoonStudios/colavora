import React from "react";
import { Text, View } from "@components/Themed";
import { styles } from "./Login.styles";
import TextInput from "@molecules/TextInput";
import CompanyLogo from "@atoms/CompanyLogo";
import { useTranslation } from "react-i18next";
import Button from "@atoms/Button";
import { useLogin } from "@hooks/Auth";
import LoginButton from "@molecules/LoginButton";

export default function Login() {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  // --- END: Data and handlers ------------------------------------------------

  return (
    <View style={styles.container}>
      <CompanyLogo />
      <View style={styles.formContainer}>
        <TextInput
          clearTextOnFocus={false}
          inputMode="email"
          label={t("USERNAME")}
        />
        <TextInput
          clearTextOnFocus={false}
          inputMode="text"
          label={t("PASSWORD")}
        />
      </View>
      <LoginButton userName="joseleoc123@gmail.com" password="*Test123" />
      <Text>{t("POWERED_BY")}</Text>
    </View>
  );
}
