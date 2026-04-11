/**
 * Secure storage wrapper.
 * - Uses expo-secure-store (Keychain / Android Keystore) for sensitive keys.
 * - Falls back to AsyncStorage if the value exceeds SecureStore's 2 KB limit
 *   or if the platform doesn't support it (web).
 */

import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const SECURE_KEYS = ["token", "user"] as const;
type SecureKey = (typeof SECURE_KEYS)[number];

const isSecureKey = (key: string): key is SecureKey =>
  (SECURE_KEYS as readonly string[]).includes(key);

// expo-secure-store is not available on web
const canUseSecureStore = Platform.OS !== "web";

export async function setItem(key: string, value: string): Promise<void> {
  if (canUseSecureStore && isSecureKey(key)) {
    try {
      await SecureStore.setItemAsync(key, value);
      return;
    } catch {
      // Value too large or unavailable — fall through to AsyncStorage
    }
  }
  await AsyncStorage.setItem(key, value);
}

export async function getItem(key: string): Promise<string | null> {
  if (canUseSecureStore && isSecureKey(key)) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      // Fall through to AsyncStorage
    }
  }
  return AsyncStorage.getItem(key);
}

export async function removeItem(key: string): Promise<void> {
  if (canUseSecureStore && isSecureKey(key)) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
  }
  // Also clean up any legacy AsyncStorage value for this key
  await AsyncStorage.removeItem(key);
}
