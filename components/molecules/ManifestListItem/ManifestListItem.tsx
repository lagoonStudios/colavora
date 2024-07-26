import React from "react";
import Card from "@atoms/Card";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Text, View } from "@components/Themed";

import { styles } from "./ManifestListItem.styles";
import { ManifestListItemProps } from "./ManifestListItem.types";
import { Link } from "expo-router";
import { Pressable } from "react-native";

export default function ManifestListItem(props: ManifestListItemProps) {
  const { code, date, count } = props;
  return (
    <Link href={"/OrdersList"} asChild>
      <Pressable>
        <Card style={styles.container}>
          <FontAwesome name="list-ul" size={25} color="gray" />
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{`${code} - ${date}`}</Text>
            <Text style={styles.count}>{`(${count})`}</Text>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}
