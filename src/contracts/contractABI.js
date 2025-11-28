import { ethers } from 'ethers';
import { 
  NFT_ABI, 
  MARKETPLACE_ABI, 
  ERC20_ABI, 
  CONTRACT_ADDRESSES 
} from '../contracts/contractABI';

const POLYGON_RPC = 'https://polygon-rpc.com';

export const provider = new ethers.JsonRpcProvider(POLYGON_RPC);

export const getNFTContract = () => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.NFT,
    NFT_ABI,
    provider
  );
};

export const getMarketplaceContract = () => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.MARKETPLACE,
    MARKETPLACE_ABI,
    provider
  );
};

export const getUSDCContract = () => {
  return new ethers.Contract(
    CONTRACT_ADDRESSES.USDC,
    ERC20_ABI,
    provider
  );
};

export const fetchUserData = async (address) => {
  try {
    const nftContract = getNFTContract();
    const marketplaceContract = getMarketplaceContract();
    const usdcContract = getUSDCContract();

    const [nftBalance, usdcBalance, decimals, pendingEarnings] = await Promise.all([
      nftContract.balanceOf(address),
      usdcContract.balanceOf(address),
      usdcContract.decimals(),
      marketplaceContract.getPendingAmount(address),
    ]);

    return {
      nftBalance: Number(nftBalance),
      usdcBalance: Number(ethers.formatUnits(usdcBalance, decimals)),
      pendingEarnings: Number(ethers.formatUnits(pendingEarnings, 6)),
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
