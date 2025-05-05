import React from 'react';
import Header from './components/Header';
import PoolStatsCard from './components/PoolStatsCard';
import PositionCard from './components/PositionCard';
import LendingForm from './components/LendingForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">SimpleLend Protocol</h1>
        <p className="text-gray-600 mb-8">
          Fixed 5% interest rate Bitcoin lending protocol with 90% max LTV and 95% liquidation threshold.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PositionCard />
          <PoolStatsCard />
        </div>
        
        <div className="mb-8">
          <LendingForm />
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">How It Works</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800">Fixed Interest Rate</h3>
              <p className="text-gray-600">
                SimpleLend offers a fixed 5% annual interest rate on all loans, providing predictability for long-term BTC holders.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Conservative LTV Ratio</h3>
              <p className="text-gray-600">
                Maximum loan-to-value ratio is 90%, with liquidation occurring at 95% LTV, creating a safety buffer against market volatility.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">SimpleUSD Stablecoin</h3>
              <p className="text-gray-600">
                Borrow SimpleUSD, a BTC-backed stablecoin that can be redeemed for BTC at a fixed rate of 1 SimpleUSD = $0.995 worth of BTC.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-800">Liquidation Process</h3>
              <p className="text-gray-600">
                If your position's LTV reaches 95%, it becomes eligible for liquidation. Liquidators can repay your loan and receive your collateral at a discount.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">SimpleLend</h3>
              <p className="text-gray-400">Fixed-rate Bitcoin lending protocol</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Discord
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>© 2023 SimpleLend Protocol. All rights reserved.</p>
            <p className="mt-2">
              This is a demo application. Not for production use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
