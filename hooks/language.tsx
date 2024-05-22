import i18next from 'i18next';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useDefaultLanguage() {
  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('lang');
        if (jsonValue != null) i18next.changeLanguage(jsonValue);
      } catch (e) {
        // error reading value
      }
    };

    getData();
  }, []);
}
