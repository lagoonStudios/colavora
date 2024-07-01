import Card from '@atoms/Card';
import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@components/Themed';

interface HomeItem {
  id: number;
  title: string;
  description: string;
}

const data = [
  { id: 1, title: 'Tarjeta 1', description: 'Descripción de la tarjeta 1' },
  { id: 2, title: 'Tarjeta 2', description: 'Descripción de la tarjeta 2' },
  { id: 3, title: 'Tarjeta 3', description: 'Descripción de la tarjeta 3' },
  // ... Más datos de la tarjeta
];

export default function Home() {
  const renderItem = ({ item }: { item: HomeItem }) => (
    <Card key={item.id} styles={homeStyles.item}>
      <Text>{item.title}</Text>
      <Text>{item.description}</Text>
    </Card>
  );

  return (
    <SafeAreaView style={homeStyles.container}>
      <FlatList data={data} renderItem={renderItem} />
    </SafeAreaView>
  );
}

const homeStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    margin: 16,
  },
  item: {},
  description: {},
  counter: {},
});
