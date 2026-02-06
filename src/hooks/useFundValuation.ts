import { useState, useEffect, useCallback } from 'react';
import { ValuationService } from '@/services/valuation';
import { Fund } from '@/types';

export function useFundValuation(codes: string[], interval = 5000) {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (codes.length === 0) return;
    try {
      const data = await ValuationService.getFundValuation(codes);
      setFunds(data);
      setError(null);
    } catch (e) {
      setError('Failed to fetch valuation');
      console.error(e);
    }
  }, [codes]);

  useEffect(() => {
    fetch();
    const timer = setInterval(fetch, interval);
    return () => clearInterval(timer);
  }, [fetch, interval]);

  return { funds, loading, error, refetch: fetch };
}
