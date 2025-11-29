// src/hooks/useWallet.js
// Custom hook for wallet connection

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NETWORK } from '../contracts/addresses';

export function useWallet() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask!');
        return false;
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      setAccount(accounts[0]);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setChainId(Number(network.chainId));
      setIsConnected(true);
      setError('');

      if (Number(network.chainId) !== NETWORK.CHAIN_ID) {
        await switchNetwork();
      }

      return true;
    } catch (err) {
      setError(err.message);
      console.error('Connection error:', err);
      return false;
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${NETWORK.CHAIN_ID.toString(16)}` }],
      });
    } catch (err) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${NETWORK.CHAIN_ID.toString(16)}`,
              chainName: NETWORK.NAME,
              rpcUrls: [NETWORK.RPC_URL],
              blockExplorerUrls: [NETWORK.BLOCK_EXPLORER],
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
              }
            }],
          });
        } catch (addError) {
          setError('Failed to add network');
          console.error('Add network error:', addError);
        }
      } else {
        setError('Failed to switch network');
        console.error('Switch network error:', err);
      }
    }
  };

  const disconnect = () => {
    setAccount('');
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setChainId(null);
    setError('');
  };

  const isCorrectNetwork = chainId === NETWORK.CHAIN_ID;

  return {
    account,
    provider,
    signer,
    isConnected,
    chainId,
    isCorrectNetwork,
    error,
    connectWallet,
    switchNetwork,
    disconnect
  };
}
