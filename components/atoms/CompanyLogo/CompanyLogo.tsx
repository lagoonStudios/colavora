import { View } from "@components/Themed";
import React from "react";
import { Image } from "react-native";

export default function CompanyLogo() {
  return (
    <View lightColor="none" darkColor="none">
      <Image
        source={require("@assets/images/avatar.png")}
        style={{ width: 150, height: 150, maxHeight: 150, maxWidth: 150 }}
        height={150}
        width={150}
        resizeMode="contain"
      />
    </View>
  );
}
