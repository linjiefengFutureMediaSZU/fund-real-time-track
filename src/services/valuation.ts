import { fetchStockPrices } from '@/api';
import { Fund } from '@/types';

export const ValuationService = {
  async getFundValuation(codes: string[]): Promise<Fund[]> {
    if (codes.length === 0) return [];
    
    // Pass through codes. Logic for prefixing should be in api or here if we know fund types.
    // For now, assuming codes are passed correctly (e.g. s_sh000001)
    const prices = await fetchStockPrices(codes);
    
    return Object.values(prices).map(p => ({
      code: p.code,
      name: p.name,
      valuation: p.price,
      change: p.change,
      changePercent: p.percent, 
      valuationTime: new Date().toLocaleTimeString(),
    }));
  }
};
