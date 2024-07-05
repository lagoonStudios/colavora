import React from "react";
import { View, Text } from "@components/Themed";
import { Image } from "react-native";
import { styles } from "./LoggedHeader.styles";

export default function LoggedHeader() {
  return (
    <View style={styles.loggedHeaderContainer}>
      <Image
        source={require("@assets/images/avatar.png")}
        style={styles.image}
      ></Image>
      <View style={styles.infoContainer}>
        <Text style={styles.companyText}>Advance Logistics</Text>
        <Text style={styles.userText}>816 Frank Santiago</Text>
        <Text style={styles.statusText}>Online</Text>
      </View>
    </View>
  );
}
