// src/contracts/abis.js
// Import and export all contract ABIs

import NFT_ABI from './nft-abi.json';
import MARKETPLACE_ABI from './marketplace-abi.json';

// USDC ABI (Standard ERC20 functions we need)
export const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function transfer(address to, uint256 amount) external returns (bool)"
];

export { NFT_ABI, MARKETPLACE_ABI };
