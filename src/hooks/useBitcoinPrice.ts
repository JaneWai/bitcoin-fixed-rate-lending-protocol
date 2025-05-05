import { useState, useEffect } from 'react';

// Mock function to simulate fetching BTC price
// In a real app, this would connect to a price oracle or API
export const useBitcoinPrice = () => {
  const [price, setPrice] = useState<number>(30000);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        // Simulate API call with random price fluctuations
        // In production, replace with actual API call
        setTimeout(() => {
          // Random price between 29000 and 31000
          const mockPrice = 30000 + (Math.random() * 2000 - 1000);
          setPrice(Math.round(mockPrice));
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch Bitcoin price');
        setLoading(false);
      }
    };

    fetchPrice();
    
    // Refresh price every 30 seconds
    const interval = setInterval(fetchPrice, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { price, loading, error };
};
