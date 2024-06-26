import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeLanguageData = async (value: string) => {
  try {
    await AsyncStorage.setItem("lang", value);
  } catch (e) {
    // saving error
  }
};
