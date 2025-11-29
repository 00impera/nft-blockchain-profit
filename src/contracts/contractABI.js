import { ethers } from 'ethers';
import {
  NFT_ABI,
  MARKETPLACE_ABI,
  USDC_ABI
} from './abis';
import {
  ADDRESSES,
  NETWORK
} from './addresses';

const provider = new ethers.JsonRpcProvider(NETWORK.RPC_URL);

export const getNFTContract = () => {
  return new ethers.Contract(
    ADDRESSES.NFT,
    NFT_ABI,
    provider
  );
};

export const getMarketplaceContract = () => {
  return new ethers.Contract(
    ADDRESSES.MARKETPLACE,
    MARKETPLACE_ABI,
    provider
  );
};

export const getUSDCContract = () => {
  return new ethers.Contract(
    ADDRESSES.USDC,
    USDC_ABI,
    provider
  );
};
