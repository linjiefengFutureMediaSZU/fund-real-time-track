import AsyncStorage from '@react-native-async-storage/async-storage';
import { Holding } from '@/types';

const KEYS = {
  FAVORITES: 'favorites',
  HOLDINGS: 'holdings',
  SETTINGS: 'settings',
};

export const StorageService = {
  async getFavorites(): Promise<string[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.FAVORITES);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      console.error('Failed to load favorites', e);
      return [];
    }
  },

  async saveFavorites(favorites: string[]) {
    try {
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  },

  async getHoldings(): Promise<Holding[]> {
    try {
      const json = await AsyncStorage.getItem(KEYS.HOLDINGS);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      console.error('Failed to load holdings', e);
      return [];
    }
  },

  async saveHoldings(holdings: Holding[]) {
    try {
      await AsyncStorage.setItem(KEYS.HOLDINGS, JSON.stringify(holdings));
    } catch (e) {
      console.error('Failed to save holdings', e);
    }
  },
};
