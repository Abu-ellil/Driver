import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const StorageService = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    }

    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Ignore storage write errors to keep UI responsive.
      }
      return;
    }

    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Ignore storage write errors to keep UI responsive.
    }
  },
};
