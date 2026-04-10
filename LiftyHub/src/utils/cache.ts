import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "@cache_";

export const saveCache = async (key: string, data: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {}
};

export const loadCache = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};
