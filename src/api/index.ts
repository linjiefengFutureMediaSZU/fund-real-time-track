/**
 * 新浪财经行情 API 服务
 */

import { Platform } from 'react-native';
import { StockPrice, NewsItem, Fund, FundData } from '@/types';

const SINA_HQ_URL = 'https://hq.sinajs.cn/list=';

export { StockPrice, NewsItem };

export interface FundHistoryItem {
    date: string;
    value: number;
}

/**
 * Generate mock stock price data for Web environment (CORS workaround)
 */
const getMockStockPrice = (code: string): StockPrice => {
  const isUp = Math.random() > 0.45;
  const changePercent = (Math.random() * 0.03 * (isUp ? 1 : -1));
  const basePrice = code.includes('000001') ? 3000 : 100;
  
  return {
    code,
    name: code.startsWith('s_') ? '模拟指数' : '模拟股票',
    price: basePrice * (1 + changePercent),
    change: basePrice * changePercent,
    percent: changePercent
  };
};

/**
 * 批量获取股票实时价格
 */
export const fetchStockPrices = async (codes: string[]): Promise<Record<string, StockPrice>> => {
  if (codes.length === 0) return {};

  if (Platform.OS === 'web') {
    const mockResults: Record<string, StockPrice> = {};
    codes.forEach(code => {
      mockResults[code] = getMockStockPrice(code);
    });
    return new Promise(resolve => setTimeout(() => resolve(mockResults), 300));
  }

  try {
    const response = await fetch(`${SINA_HQ_URL}${codes.join(',')}`, {
      headers: {
        'Referer': 'https://finance.sina.com.cn'
      }
    });
    
    const text = await response.text();
    const lines = text.split('\n');
    const results: Record<string, StockPrice> = {};

    lines.forEach((line) => {
      const match = line.match(/hq_str_(.*)="(.*)";/);
      if (match && match[2]) {
        const code = match[1];
        const parts = match[2].split(',');
        
        if (code.startsWith('s_')) {
             if (parts.length > 3) {
                 results[code] = {
                     code,
                     name: parts[0],
                     price: parseFloat(parts[1]),
                     change: parseFloat(parts[2]),
                     percent: parseFloat(parts[3]) / 100
                 };
             }
        } else if (parts.length > 3) {
          results[code] = {
              code,
              name: parts[0],
              price: parseFloat(parts[3]),
              change: parseFloat(parts[3]) - parseFloat(parts[2]),
              percent: (parseFloat(parts[3]) - parseFloat(parts[2])) / parseFloat(parts[2])
          };
        }
      }
    });
    
    return results;
  } catch (e) {
    console.error(e);
    return {};
  }
};

/**
 * 获取市场主要指数
 */
export const fetchMarketIndices = async (): Promise<Record<string, StockPrice>> => {
    // 上证指数, 深证成指, 创业板指
    const indices = ['s_sh000001', 's_sz399001', 's_sz399006'];
    return fetchStockPrices(indices);
};

/**
 * 获取财经新闻
 */
export const fetchFinancialNews = async (): Promise<NewsItem[]> => {
    // Mock news data
    return [
        {
            id: '1',
            title: 'A股三大指数集体收涨，新能源板块领涨',
            source: '财联社',
            time: '10分钟前',
            url: 'https://finance.sina.com.cn'
        },
        {
            id: '2',
            title: '美联储暗示年内降息，全球股市普涨',
            source: '华尔街见闻',
            time: '30分钟前',
            url: 'https://finance.sina.com.cn'
        },
        {
            id: '3',
            title: '基金发行回暖，多只权益类基金提前结束募集',
            source: '证券时报',
            time: '1小时前',
            url: 'https://finance.sina.com.cn'
        },
        {
            id: '4',
            title: '科技股回调，分析师提示短期风险',
            source: '新浪财经',
            time: '2小时前',
            url: 'https://finance.sina.com.cn'
        }
    ];
};

/**
 * Search funds by code or name (Mock)
 */
export const searchFunds = async (query: string): Promise<Fund[]> => {
    // Mock search results
    if (!query) return [];
    
    return [
        { code: '000001', name: '华夏成长混合', type: '混合型' },
        { code: '000002', name: '华夏成长混合C', type: '混合型' },
        { code: '110011', name: '易方达中小盘', type: '混合型' },
        { code: '000123', name: '招商白酒指数', type: '指数型' }
    ].filter(f => f.code.includes(query) || f.name.includes(query));
};

/**
 * Fetch fund history (Mock)
 */
export const fetchFundHistory = async (code: string, period: string = '1m'): Promise<FundHistoryItem[]> => {
    // Mock history data
    const history: FundHistoryItem[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (29 - i));
        history.push({
            date: date.toISOString().split('T')[0],
            value: 1.0 + Math.random() * 0.5
        });
    }
    return history;
};
