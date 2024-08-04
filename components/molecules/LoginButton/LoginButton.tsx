import React from "react";
import { useTranslation } from "react-i18next";

import Button from "@atoms/Button";
import { PressableProps } from "react-native";

export default function LoginButton(props: PressableProps) {
  const { t } = useTranslation();

  return (
    <>
      <Button {...props} label={t("LOGIN.LOGIN")} />
    </>
  );
}
