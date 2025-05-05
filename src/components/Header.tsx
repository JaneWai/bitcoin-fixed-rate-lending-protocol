import React from 'react';
import { Bitcoin } from 'lucide-react';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';

const Header: React.FC = () => {
  const { price, loading } = useBitcoinPrice();

  return (
    <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bitcoin className="h-8 w-8" />
          <h1 className="text-2xl font-bold">SimpleLend</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="text-xs opacity-80">BTC Price</div>
            <div className="font-bold">
              {loading ? 'Loading...' : `$${price.toLocaleString()}`}
            </div>
          </div>
          
          <button className="bg-white text-orange-600 hover:bg-orange-100 px-4 py-2 rounded-lg font-medium transition-colors">
            Connect Wallet
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
