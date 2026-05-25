import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "@cache_";
const TTL_MS = 5 * 60 * 1000; // 5 minutos

type CacheEntry<T> = { data: T; savedAt: number };

export const saveCache = async (key: string, data: any): Promise<void> => {
  try {
    const entry: CacheEntry<typeof data> = { data, savedAt: Date.now() };
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {}
};

export const loadCache = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - entry.savedAt > TTL_MS) {
      await AsyncStorage.removeItem(PREFIX + key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
};
