import { ERROR_CODE } from "@constants/Errors";
import { Alert } from "react-native";
import i18next from "i18next";

export default function handleErrorMessage({
  error,
  title,
  customMessage,
}: {
  error: unknown;
  title?: string;
  customMessage?: string;
}) {
  console.error("Error:", error);
  const { t, exists } = i18next;

  let message = customMessage;
  const errorTitle = title ? title : t("ERRORS.ERROR");

  try {
    if (error && customMessage === undefined) {
      let code = "";

      if (typeof error?.name === "string") {
        code = `ERRORS.${error.name.toUpperCase()}`;
      } else if (typeof error?.code === "string") {
        code = `ERRORS.${error.code.toUpperCase()}`;
      }
      if (exists(code)) {
        message = t(code);
      }
    }

    if (!message) {
      message = t(`ERRORS.${ERROR_CODE.UNKNOWN}`);
    }
  } catch (error) {
    message = customMessage ? customMessage : t(`ERRORS.${ERROR_CODE.UNKNOWN}`);
  }

  Alert.alert(errorTitle, message);
}
