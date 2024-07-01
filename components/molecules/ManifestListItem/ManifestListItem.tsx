import React from 'react';
import Card from '@atoms/Card';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { Text, View } from '@components/Themed';

import { styles } from './ManifestListItem.styles';
import { ManifestListItemProps } from './ManifestListItem.types';

export default function ManifestListItem(props: ManifestListItemProps) {
  const { code, date, count } = props;
  return (
    <Card style={styles.container}>
      <FontAwesome name="list-ul" size={25} color="gray" />
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{`${code} - ${date}`}</Text>
        <Text style={styles.count}>{`(${count})`}</Text>
      </View>
    </Card>
  );
}
