import { useState, useEffect } from 'react';
import { PoolStats } from '../types';
import { useBitcoinPrice } from './useBitcoinPrice';

// Mock hook to simulate pool statistics
// In a real app, this would fetch data from a smart contract
export const usePoolStats = () => {
  const { price: btcPrice } = useBitcoinPrice();
  const [stats, setStats] = useState<PoolStats>({
    totalBtcLocked: 0,
    totalSimpleUsdMinted: 0,
    currentBtcPrice: btcPrice,
    poolUtilization: 0
  });

  useEffect(() => {
    // Simulate fetching pool stats
    const fetchStats = () => {
      // Mock data - in production this would come from blockchain
      const mockTotalBtcLocked = 125.5;
      const mockTotalSimpleUsdMinted = 3375000;
      const mockPoolUtilization = mockTotalSimpleUsdMinted / (mockTotalBtcLocked * btcPrice * 0.9);
      
      setStats({
        totalBtcLocked: mockTotalBtcLocked,
        totalSimpleUsdMinted: mockTotalSimpleUsdMinted,
        currentBtcPrice: btcPrice,
        poolUtilization: mockPoolUtilization
      });
    };

    fetchStats();
    
    // Refresh stats every minute
    const interval = setInterval(fetchStats, 60000);
    
    return () => clearInterval(interval);
  }, [btcPrice]);

  return stats;
};
