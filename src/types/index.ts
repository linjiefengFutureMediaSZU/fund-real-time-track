export interface Fund {
  code: string;
  name: string;
  type?: string;
  netValue?: number; // Latest official net value
  netValueDate?: string;
  valuation?: number; // Real-time estimated value
  valuationTime?: string;
  change?: number;
  changePercent?: number; // Percentage
  dayChange?: number; // From yesterday
  dayChangePercent?: number;
}

export interface Holding {
  code: string;
  costPrice: number;
  amount: number; // Share count
  totalCost: number;
  // Computed fields for UI
  name?: string;
  type?: string;
  holdingValue?: number;
  dailyProfit?: number;
  holdingProfit?: number;
}

// Combine Fund and Holding for UI display
export type FundData = Fund & Partial<Holding>;

export interface UserSettings {
  refreshInterval: number; // seconds
  theme: 'system' | 'light' | 'dark';
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  url: string;
}

export interface UserProfile {
  id: string;
  nickname: string;
  avatar?: string;
  bio?: string;
  privacyLockEnabled: boolean;
}

export interface StockPrice {
  code: string;
  name: string;
  price: number;
  change: number; // 涨跌额
  percent: number; // 涨跌幅
}
