import React from 'react';
import { useUserPosition } from '../hooks/useUserPosition';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';
import { AlertCircle, TrendingDown } from 'lucide-react';

const PositionCard: React.FC = () => {
  const { position } = useUserPosition();
  const { price: btcPrice } = useBitcoinPrice();
  
  // Calculate health factor (1 is liquidation, higher is better)
  const healthFactor = position.loanAmount > 0 
    ? 0.95 / position.ltv 
    : Infinity;
  
  // Determine health status
  let healthStatus: 'safe' | 'warning' | 'danger' = 'safe';
  if (healthFactor < 1.1) {
    healthStatus = 'danger';
  } else if (healthFactor < 1.3) {
    healthStatus = 'warning';
  }
  
  // Format health factor for display
  const formattedHealthFactor = healthFactor === Infinity 
    ? '∞' 
    : healthFactor.toFixed(2);
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Your Position</h2>
      
      {position.collateralAmount > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Collateral</div>
              <p className="text-xl font-bold text-gray-800">
                {position.collateralAmount.toFixed(8)} BTC
              </p>
              <p className="text-sm text-gray-500">
                ${(position.collateralAmount * btcPrice).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Loan</div>
              <p className="text-xl font-bold text-gray-800">
                ${position.loanAmount.toLocaleString()} SimpleUSD
              </p>
              <p className="text-sm text-gray-500">
                5.00% fixed interest rate
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Current LTV</div>
              <p className="text-xl font-bold text-gray-800">
                {(position.ltv * 100).toFixed(2)}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    position.ltv > 0.85 ? 'bg-red-500' : 
                    position.ltv > 0.75 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, position.ltv * 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>90%</span>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Liquidation Price</div>
              <p className="text-xl font-bold text-gray-800">
                {position.liquidationPrice > 0 
                  ? `$${position.liquidationPrice.toLocaleString()}` 
                  : 'N/A'}
              </p>
              {position.liquidationPrice > 0 && (
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingDown className={`h-4 w-4 ${
                    btcPrice < position.liquidationPrice * 1.2 
                      ? 'text-red-500' 
                      : 'text-gray-500'
                  }`} />
                  <span className={
                    btcPrice < position.liquidationPrice * 1.2 
                      ? 'text-red-500' 
                      : 'text-gray-500'
                  }>
                    {(((position.liquidationPrice - btcPrice) / btcPrice) * 100).toFixed(2)}% from current price
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {position.loanAmount > 0 && (
            <div className={`mt-6 p-4 rounded-lg flex items-start space-x-3 ${
              healthStatus === 'danger' 
                ? 'bg-red-50 text-red-700' 
                : healthStatus === 'warning' 
                  ? 'bg-yellow-50 text-yellow-700' 
                  : 'bg-green-50 text-green-700'
            }`}>
              <AlertCircle className="h-5 w-5 mt-0.5" />
              <div>
                <p className="font-medium">
                  Health Factor: {formattedHealthFactor}
                </p>
                <p className="text-sm mt-1">
                  {healthStatus === 'danger' 
                    ? 'Your position is at high risk of liquidation. Consider repaying part of your loan or adding more collateral immediately.' 
                    : healthStatus === 'warning' 
                      ? 'Your position is getting close to the liquidation threshold. Consider improving your health factor.' 
                      : 'Your position is healthy and not at risk of liquidation.'}
                </p>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't have any active positions.</p>
          <p className="text-gray-600">
            Deposit BTC as collateral to start borrowing SimpleUSD at a fixed 5% interest rate.
          </p>
        </div>
      )}
    </div>
  );
};

export default PositionCard;
