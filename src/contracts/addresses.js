// src/contracts/addresses.js
// Contract addresses and network configuration

export const ADDRESSES = {
  NFT: '0x4e4Cd138F5B45D98C0511D7309f99C6e0656cAe1',
  MARKETPLACE: '0x5e3Ad80a03E7dA15B4b74DC3Aa35661996E6b263',
  USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  FEE_COLLECTOR: '0x592B35c8917eD36c39Ef73D0F5e92B0173560b2e'
};

export const NETWORK = {
  CHAIN_ID: 137,
  NAME: 'Polygon',
  RPC_URL: 'https://polygon-rpc.com',
  BLOCK_EXPLORER: 'https://polygonscan.com'
};

// USDC has 6 decimals on Polygon
export const USDC_DECIMALS = 6;
