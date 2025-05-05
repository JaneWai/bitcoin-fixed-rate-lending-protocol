export interface UserPosition {
  collateralAmount: number; // BTC amount
  loanAmount: number; // SimpleUSD amount
  ltv: number; // current loan-to-value ratio
  liquidationPrice: number; // BTC price at which position will be liquidated
}

export interface PoolStats {
  totalBtcLocked: number;
  totalSimpleUsdMinted: number;
  currentBtcPrice: number;
  poolUtilization: number;
}
