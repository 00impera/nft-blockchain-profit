// src/hooks/useContracts.js
// Custom hook to create contract instances

import { useMemo } from 'react';
import { ethers } from 'ethers';
import { NFT_ABI, MARKETPLACE_ABI, USDC_ABI } from '../contracts/abis';
import { ADDRESSES } from '../contracts/addresses';

export function useContracts(signer) {
  const nftContract = useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(ADDRESSES.NFT, NFT_ABI, signer);
  }, [signer]);

  const marketplaceContract = useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(ADDRESSES.MARKETPLACE, MARKETPLACE_ABI, signer);
  }, [signer]);

  const usdcContract = useMemo(() => {
    if (!signer) return null;
    return new ethers.Contract(ADDRESSES.USDC, USDC_ABI, signer);
  }, [signer]);

  return {
    nftContract,
    marketplaceContract,
    usdcContract
  };
}
