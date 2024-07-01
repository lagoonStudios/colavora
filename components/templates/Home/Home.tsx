import React from 'react';
import { FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import Card from '@atoms/Card';
import { Text } from '@components/Themed';

import styles from './Home.styles';
import { HomeItem } from './Home.types';
import { useHomeData } from './Home.functions';

export default function Home() {
  // --- Hooks -----------------------------------------------------------------
  const { data, loading } = useHomeData();
  // --- END: Hooks ------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  const renderItem = ({ item }: { item: HomeItem }) => (
    <Link href={item.route} asChild>
      <Pressable>
        <Card style={styles.item}>
          <Text style={styles.description}>{item.description}</Text>
          {loading ? <Text>Loading...</Text> : <Text style={styles.counter}>{item.counter}</Text>}
        </Card>
      </Pressable>
    </Link>
  );
  // --- END: Data and handlers ------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={data} renderItem={renderItem} />
    </SafeAreaView>
  );
}
