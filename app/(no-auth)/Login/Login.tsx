import React from "react";
import { Text, View } from "@components/Themed";
import { styles } from "./Login.styles";
import TextInput from "@molecules/TextInput";
import CompanyLogo from "@atoms/CompanyLogo";
import { useTranslation } from "react-i18next";
import Button from "@atoms/Button";

export default function Login() {
  const { t } = useTranslation();
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
      <Button />
      <Text>{t("POWERED_BY")}</Text>
    </View>
  );
}
