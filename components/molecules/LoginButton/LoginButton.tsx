import React from "react";
import { useTranslation } from "react-i18next";

import useAuth from "@hooks/Auth";

import Button from "@atoms/Button";
import { ActivityIndicator } from "@components/Themed";
import { Alert, PressableProps } from "react-native";

type LoginButtonProps = {
  userName: string;
  password: string;
};
export default function LoginButton(props: PressableProps) {
  // const { userName, password } = props;
  // const { login, loading } = useAuth();
  const { t } = useTranslation();

  // const onSubmit = () => {
  //   if (userName.trim() === "") {
  //     Alert.alert("Error", "Please enter a username");
  //     return;
  //   }
  //   if (password.trim() === "") {
  //     Alert.alert("Error", "Please enter a password");
  //     return;
  //   }
  //   login({ userName: userName, password: password });
  // };

  return (
    <>
      <Button {...props} label={t("LOGIN")} />
    </>
  );
}
