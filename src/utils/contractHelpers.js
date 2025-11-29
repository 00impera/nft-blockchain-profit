// src/utils/contractHelpers.js
// Helper functions for contract interactions

import { ethers } from 'ethers';
import { USDC_DECIMALS } from '../contracts/addresses';

export const formatUSDC = (amount) => {
  return ethers.formatUnits(amount, USDC_DECIMALS);
};

export const parseUSDC = (amount) => {
  return ethers.parseUnits(amount.toString(), USDC_DECIMALS);
};

export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getExplorerLink = (address, type = 'address') => {
  const baseUrl = 'https://polygonscan.com';
  return `${baseUrl}/${type}/${address}`;
};

export const handleTxError = (error) => {
  console.error('Transaction error:', error);
  
  if (error.code === 'ACTION_REJECTED') {
    return 'Transaction rejected by user';
  }
  
  if (error.message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  }
  
  if (error.message.includes('user rejected')) {
    return 'Transaction rejected';
  }
  
  return error.message || 'Transaction failed';
};
