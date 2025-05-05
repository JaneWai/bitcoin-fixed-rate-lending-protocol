import React from 'react';
import { TrendingUp, BarChart3, Percent } from 'lucide-react';
import { usePoolStats } from '../hooks/usePoolStats';

const PoolStatsCard: React.FC = () => {
  const stats = usePoolStats();

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Pool Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-gray-600 mb-1">
            <Bitcoin className="h-4 w-4" />
            <span className="text-sm">Total BTC Locked</span>
          </div>
          <p className="text-xl font-bold text-gray-800">{stats.totalBtcLocked.toFixed(2)} BTC</p>
          <p className="text-sm text-gray-500">
            ${(stats.totalBtcLocked * stats.currentBtcPrice).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-gray-600 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Total SimpleUSD Minted</span>
          </div>
          <p className="text-xl font-bold text-gray-800">
            ${stats.totalSimpleUsdMinted.toLocaleString()}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-gray-600 mb-1">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm">Pool Utilization</span>
          </div>
          <p className="text-xl font-bold text-gray-800">
            {(stats.poolUtilization * 100).toFixed(2)}%
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-gray-600 mb-1">
            <Percent className="h-4 w-4" />
            <span className="text-sm">Fixed Interest Rate</span>
          </div>
          <p className="text-xl font-bold text-gray-800">5.00%</p>
          <p className="text-sm text-gray-500">Annual</p>
        </div>
      </div>
    </div>
  );
};

export default PoolStatsCard;

// Import Bitcoin icon
function Bitcoin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.767 19.089c4.924.868 9.593-2.535 10.461-7.459.868-4.924-2.535-9.593-7.459-10.461-4.924-.868-9.593 2.535-10.461 7.459-.868 4.924 2.535 9.593 7.459 10.461z" />
      <path d="M9.5 7.5h4.286c1.429 0 2.571 1.143 2.571 2.571 0 1.429-1.143 2.571-2.571 2.571H9.5v-5.142z" />
      <path d="M9.5 12.643h5.714c1.429 0 2.571 1.143 2.571 2.571 0 1.429-1.143 2.571-2.571 2.571H9.5v-5.142z" />
      <path d="M9.5 7.5V4.5" />
      <path d="M14.5 7.5V4.5" />
      <path d="M9.5 19.5v-3" />
      <path d="M14.5 19.5v-3" />
    </svg>
  );
}
