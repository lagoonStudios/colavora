import React from "react";
import { useTranslation } from "react-i18next";

import Button from "@atoms/Button";
import { PressableProps } from "react-native";

export default function SaveButton(props: PressableProps) {
  // --- Hooks -----------------------------------------------------------------
  const { t } = useTranslation();
  // --- END: Hooks ------------------------------------------------------------

  return <Button {...props} label={t("COMMENTS.SAVE")} />;
}
