import React, { createContext, useContext, useState, useEffect } from 'react';
import { Holding, UserProfile } from '@/types';
import { StorageService } from '@/services/storage';

interface FundContextType {
  favorites: string[];
  holdings: Holding[];
  userProfile: UserProfile;
  addFavorite: (code: string) => Promise<void>;
  removeFavorite: (code: string) => Promise<void>;
  addHolding: (holding: Holding) => Promise<void>;
  removeHolding: (code: string) => Promise<void>;
  updateHolding: (holding: Holding) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  resetData: () => Promise<void>;
  isFavorite: (code: string) => boolean;
}

const defaultProfile: UserProfile = {
    id: 'user_001',
    nickname: 'Fund Investor',
    privacyLockEnabled: false
};

const FundContext = createContext<FundContextType | undefined>(undefined);

export function FundProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedFavs = await StorageService.getFavorites();
    const savedHoldings = await StorageService.getHoldings();
    // In a real app, we would load profile from storage too
    setFavorites(savedFavs);
    setHoldings(savedHoldings);
  };

  const addFavorite = async (code: string) => {
    if (favorites.includes(code)) return;
    const newFavs = [...favorites, code];
    setFavorites(newFavs);
    await StorageService.saveFavorites(newFavs);
  };

  const removeFavorite = async (code: string) => {
    const newFavs = favorites.filter(c => c !== code);
    setFavorites(newFavs);
    await StorageService.saveFavorites(newFavs);
  };

  const addHolding = async (holding: Holding) => {
    const newHoldings = [...holdings, holding];
    setHoldings(newHoldings);
    await StorageService.saveHoldings(newHoldings);
  };
  
  const removeHolding = async (code: string) => {
      const newHoldings = holdings.filter(h => h.code !== code);
      setHoldings(newHoldings);
      await StorageService.saveHoldings(newHoldings);
  };

  const updateHolding = async (holding: Holding) => {
      const newHoldings = holdings.map(h => h.code === holding.code ? holding : h);
      setHoldings(newHoldings);
      await StorageService.saveHoldings(newHoldings);
  }

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
      setUserProfile(prev => ({ ...prev, ...profile }));
      // Save to storage if needed
  };

  const resetData = async () => {
      setFavorites([]);
      setHoldings([]);
      await StorageService.saveFavorites([]);
      await StorageService.saveHoldings([]);
  };

  const isFavorite = (code: string) => favorites.includes(code);

  return (
    <FundContext.Provider value={{ 
        favorites, 
        holdings, 
        userProfile,
        addFavorite, 
        removeFavorite, 
        addHolding, 
        removeHolding, 
        updateHolding, 
        updateUserProfile,
        resetData,
        isFavorite 
    }}>
      {children}
    </FundContext.Provider>
  );
}

export function useFundContext() {
  const context = useContext(FundContext);
  if (context === undefined) {
    throw new Error('useFundContext must be used within a FundProvider');
  }
  return context;
}

export const useFunds = useFundContext;
