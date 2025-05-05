import { useState } from 'react';
import { UserPosition } from '../types';
import { useBitcoinPrice } from './useBitcoinPrice';

// In a real app, this would interact with a smart contract
export const useUserPosition = () => {
  const { price: btcPrice } = useBitcoinPrice();
  const [position, setPosition] = useState<UserPosition>({
    collateralAmount: 0,
    loanAmount: 0,
    ltv: 0,
    liquidationPrice: 0
  });

  // Constants
  const INTEREST_RATE = 0.05; // 5% fixed interest rate
  const MAX_LTV = 0.9; // 90% maximum loan-to-value ratio
  const LIQUIDATION_LTV = 0.95; // 95% liquidation threshold
  const REDEMPTION_RATE = 0.995; // 1 SimpleUSD = $0.995 worth of BTC

  const calculateMaxLoan = (btcAmount: number): number => {
    return btcAmount * btcPrice * MAX_LTV;
  };

  const calculateLiquidationPrice = (btcAmount: number, loanAmount: number): number => {
    return loanAmount / (btcAmount * LIQUIDATION_LTV);
  };

  const calculateCurrentLtv = (btcAmount: number, loanAmount: number): number => {
    return loanAmount / (btcAmount * btcPrice);
  };

  const depositCollateral = (btcAmount: number) => {
    const newPosition = {
      collateralAmount: btcAmount,
      loanAmount: 0,
      ltv: 0,
      liquidationPrice: 0
    };
    setPosition(newPosition);
    return newPosition;
  };

  const borrowSimpleUsd = (amount: number) => {
    if (amount > calculateMaxLoan(position.collateralAmount)) {
      throw new Error('Loan amount exceeds maximum allowed');
    }

    const newPosition = {
      ...position,
      loanAmount: amount,
      ltv: calculateCurrentLtv(position.collateralAmount, amount),
      liquidationPrice: calculateLiquidationPrice(position.collateralAmount, amount)
    };
    
    setPosition(newPosition);
    return newPosition;
  };

  const repayLoan = (amount: number) => {
    if (amount > position.loanAmount) {
      throw new Error('Repayment amount exceeds loan balance');
    }

    const newLoanAmount = position.loanAmount - amount;
    const newPosition = {
      ...position,
      loanAmount: newLoanAmount,
      ltv: calculateCurrentLtv(position.collateralAmount, newLoanAmount),
      liquidationPrice: newLoanAmount > 0 
        ? calculateLiquidationPrice(position.collateralAmount, newLoanAmount)
        : 0
    };
    
    setPosition(newPosition);
    return newPosition;
  };

  const withdrawCollateral = (btcAmount: number) => {
    if (btcAmount > position.collateralAmount) {
      throw new Error('Withdrawal amount exceeds collateral balance');
    }

    const newCollateralAmount = position.collateralAmount - btcAmount;
    
    // Check if remaining collateral is sufficient for the loan
    if (position.loanAmount > 0) {
      const newLtv = calculateCurrentLtv(newCollateralAmount, position.loanAmount);
      if (newLtv > MAX_LTV) {
        throw new Error('Withdrawal would exceed maximum LTV');
      }
    }

    const newPosition = {
      collateralAmount: newCollateralAmount,
      loanAmount: position.loanAmount,
      ltv: newCollateralAmount > 0 
        ? calculateCurrentLtv(newCollateralAmount, position.loanAmount)
        : 0,
      liquidationPrice: position.loanAmount > 0 && newCollateralAmount > 0
        ? calculateLiquidationPrice(newCollateralAmount, position.loanAmount)
        : 0
    };
    
    setPosition(newPosition);
    return newPosition;
  };

  const swapSimpleUsdToBtc = (simpleUsdAmount: number) => {
    if (simpleUsdAmount > position.loanAmount) {
      throw new Error('Swap amount exceeds SimpleUSD balance');
    }
    
    // Calculate BTC amount based on redemption rate
    const btcAmount = (simpleUsdAmount * REDEMPTION_RATE) / btcPrice;
    
    // Update loan amount
    const newLoanAmount = position.loanAmount - simpleUsdAmount;
    
    const newPosition = {
      ...position,
      loanAmount: newLoanAmount,
      ltv: calculateCurrentLtv(position.collateralAmount, newLoanAmount),
      liquidationPrice: newLoanAmount > 0 
        ? calculateLiquidationPrice(position.collateralAmount, newLoanAmount)
        : 0
    };
    
    setPosition(newPosition);
    return { newPosition, btcReceived: btcAmount };
  };

  return {
    position,
    depositCollateral,
    borrowSimpleUsd,
    repayLoan,
    withdrawCollateral,
    swapSimpleUsdToBtc,
    calculateMaxLoan,
    INTEREST_RATE,
    MAX_LTV,
    LIQUIDATION_LTV,
    REDEMPTION_RATE
  };
};
