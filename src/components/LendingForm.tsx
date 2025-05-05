import React, { useState } from 'react';
import { useUserPosition } from '../hooks/useUserPosition';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';
import { ArrowRightLeft, AlertTriangle } from 'lucide-react';

type FormTab = 'deposit' | 'borrow' | 'repay' | 'withdraw' | 'swap';

const LendingForm: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FormTab>('deposit');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { price: btcPrice } = useBitcoinPrice();
  const { 
    position, 
    depositCollateral, 
    borrowSimpleUsd, 
    repayLoan, 
    withdrawCollateral, 
    swapSimpleUsdToBtc,
    calculateMaxLoan,
    MAX_LTV,
    LIQUIDATION_LTV,
    REDEMPTION_RATE
  } = useUserPosition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      switch (activeTab) {
        case 'deposit':
          depositCollateral(numAmount);
          setSuccess(`Successfully deposited ${numAmount} BTC as collateral`);
          break;
          
        case 'borrow':
          borrowSimpleUsd(numAmount);
          setSuccess(`Successfully borrowed ${numAmount} SimpleUSD`);
          break;
          
        case 'repay':
          repayLoan(numAmount);
          setSuccess(`Successfully repaid ${numAmount} SimpleUSD`);
          break;
          
        case 'withdraw':
          withdrawCollateral(numAmount);
          setSuccess(`Successfully withdrawn ${numAmount} BTC`);
          break;
          
        case 'swap':
          const result = swapSimpleUsdToBtc(numAmount);
          setSuccess(`Successfully swapped ${numAmount} SimpleUSD for ${result.btcReceived.toFixed(8)} BTC`);
          break;
      }
      
      setAmount('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'deposit':
        return (
          <>
            <p className="text-gray-600 mb-4">
              Deposit BTC as collateral to borrow SimpleUSD at a fixed 5% interest rate.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BTC Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.0"
                  step="0.001"
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">BTC</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Value: ${amount ? (parseFloat(amount) * btcPrice).toLocaleString() : '0'}
              </div>
            </div>
          </>
        );
        
      case 'borrow':
        return (
          <>
            <p className="text-gray-600 mb-4">
              Borrow SimpleUSD against your BTC collateral. Maximum LTV: {MAX_LTV * 100}%.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SimpleUSD Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.0"
                  step="100"
                  min="0"
                  max={calculateMaxLoan(position.collateralAmount)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">SimpleUSD</span>
                </div>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">
                  Available to borrow: ${calculateMaxLoan(position.collateralAmount).toLocaleString()}
                </span>
                <button 
                  type="button"
                  onClick={() => setAmount(calculateMaxLoan(position.collateralAmount).toString())}
                  className="text-orange-500 hover:text-orange-600"
                >
                  Max
                </button>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 mb-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-700">
                    Liquidation occurs at {LIQUIDATION_LTV * 100}% LTV. Be cautious when borrowing near the maximum.
                  </p>
                </div>
              </div>
            </div>
          </>
        );
        
      case 'repay':
        return (
          <>
            <p className="text-gray-600 mb-4">
              Repay your SimpleUSD loan to reduce your position's risk.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SimpleUSD Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.0"
                  step="100"
                  min="0"
                  max={position.loanAmount}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">SimpleUSD</span>
                </div>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">
                  Outstanding loan: ${position.loanAmount.toLocaleString()}
                </span>
                <button 
                  type="button"
                  onClick={() => setAmount(position.loanAmount.toString())}
                  className="text-orange-500 hover:text-orange-600"
                >
                  Max
                </button>
              </div>
            </div>
          </>
        );
        
      case 'withdraw':
        return (
          <>
            <p className="text-gray-600 mb-4">
              Withdraw BTC collateral from your position.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BTC Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.0"
                  step="0.001"
                  min="0"
                  max={position.collateralAmount}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">BTC</span>
                </div>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">
                  Available collateral: {position.collateralAmount.toFixed(8)} BTC
                </span>
                <button 
                  type="button"
                  onClick={() => {
                    // Calculate max withdrawable amount based on current LTV
                    if (position.loanAmount > 0) {
                      const minRequiredCollateral = position.loanAmount / (btcPrice * MAX_LTV);
                      const maxWithdrawable = Math.max(0, position.collateralAmount - minRequiredCollateral);
                      setAmount(maxWithdrawable.toFixed(8));
                    } else {
                      setAmount(position.collateralAmount.toString());
                    }
                  }}
                  className="text-orange-500 hover:text-orange-600"
                >
                  Max
                </button>
              </div>
            </div>
            
            {position.loanAmount > 0 && (
              <div className="bg-orange-50 rounded-lg p-3 mb-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-orange-700">
                      You have an outstanding loan. Withdrawing too much collateral may increase your liquidation risk.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        );
        
      case 'swap':
        return (
          <>
            <p className="text-gray-600 mb-4">
              Swap your SimpleUSD for BTC at a fixed rate of 1 SimpleUSD = ${REDEMPTION_RATE} worth of BTC.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SimpleUSD Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.0"
                  step="100"
                  min="0"
                  max={position.loanAmount}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">SimpleUSD</span>
                </div>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">
                  Available: ${position.loanAmount.toLocaleString()}
                </span>
                <button 
                  type="button"
                  onClick={() => setAmount(position.loanAmount.toString())}
                  className="text-orange-500 hover:text-orange-600"
                >
                  Max
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center my-4">
              <ArrowRightLeft className="h-6 w-6 text-gray-400" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BTC to Receive
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={amount ? ((parseFloat(amount) * REDEMPTION_RATE) / btcPrice).toFixed(8) : ''}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="0.0"
                  disabled
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">BTC</span>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Rate: 1 SimpleUSD = ${REDEMPTION_RATE} worth of BTC
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="flex border-b">
        {(['deposit', 'borrow', 'repay', 'withdraw', 'swap'] as FormTab[]).map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === tab
                ? 'text-orange-600 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => {
              setActiveTab(tab);
              setAmount('');
              setError(null);
              setSuccess(null);
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {renderTabContent()}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </button>
      </form>
    </div>
  );
};

export default LendingForm;
