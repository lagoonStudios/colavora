import React from "react";

import { useFormContext } from "react-hook-form";
import ControlledInput from "@molecules/ControlledInput";
import { TextInputProps } from "@molecules/ControlledInput/ControlledInput";

export default function TextInput(props: TextInputProps) {
  // --- Local state -----------------------------------------------------------
  const { name } = props;
  // --- END: Local state ------------------------------------------------------

  // --- Hooks -----------------------------------------------------------------
  const formContext = useFormContext();
  // --- END: Hooks ------------------------------------------------------------

  if (!formContext || !name) {
    const msg = !formContext
      ? "TextInput must be wrapped by the FormProvider"
      : "Name must be defined";
    console.error(msg);
    return null;
  }

  return <ControlledInput {...props} />;
}
