// src/App.js
// Simple NFT Marketplace Test Component

import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { useContracts } from './hooks/useContracts';
import { formatUSDC, parseUSDC, shortenAddress, handleTxError } from './utils/contractHelpers';
import './App.css';

function App() {
  const { account, signer, isConnected, isCorrectNetwork, connectWallet, switchNetwork, disconnect } = useWallet();
  const { nftContract, marketplaceContract, usdcContract } = useContracts(signer);
  
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [tokenId, setTokenId] = useState('');
  const [price, setPrice] = useState('');
  const [metadataUri, setMetadataUri] = useState('');
  const [nftName, setNftName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState('');

  // Mint NFT
  const handleMint = async () => {
    if (!nftContract) return;
    
    setLoading(true);
    try {
      setStatus('Checking mint price...');
      const mintPrice = await nftContract.mintPrice();
      
      setStatus('Minting NFT...');
      const tx = await nftContract.mintNFT(
        metadataUri,
        nftName,
        description,
        imageUri,
        { value: mintPrice }
      );
      
      setStatus('Waiting for confirmation...');
      const receipt = await tx.wait();
      
      // Find the NFTMinted event to get token ID
      const event = receipt.logs.find(log => {
        try {
          const parsed = nftContract.interface.parseLog(log);
          return parsed.name === 'NFTMinted';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = nftContract.interface.parseLog(event);
        setStatus(`✅ NFT Minted! Token ID: ${parsed.args.tokenId.toString()}`);
        setTokenId(parsed.args.tokenId.toString());
      } else {
        setStatus('✅ NFT Minted successfully!');
      }
    } catch (error) {
      setStatus(`❌ ${handleTxError(error)}`);
    }
    setLoading(false);
  };

  // Approve marketplace
  const handleApprove = async () => {
    if (!nftContract || !marketplaceContract) return;
    
    setLoading(true);
    try {
      setStatus('Approving marketplace...');
      const tx = await nftContract.setApprovalForAll(marketplaceContract.target, true);
      await tx.wait();
      setStatus('✅ Marketplace approved!');
    } catch (error) {
      setStatus(`❌ ${handleTxError(error)}`);
    }
    setLoading(false);
  };

  // List NFT
  const handleList = async () => {
    if (!marketplaceContract || !tokenId || !price) {
      setStatus('❌ Please enter token ID and price');
      return;
    }
    
    setLoading(true);
    try {
      setStatus('Listing NFT...');
      const priceInWei = parseUSDC(price);
      const tx = await marketplaceContract.listItem(tokenId, priceInWei);
      await tx.wait();
      setStatus(`✅ NFT #${tokenId} listed for ${price} USDC!`);
    } catch (error) {
      setStatus(`❌ ${handleTxError(error)}`);
    }
    setLoading(false);
  };

  // Approve USDC
  const handleApproveUSDC = async () => {
    if (!usdcContract || !marketplaceContract || !price) {
      setStatus('❌ Please enter amount');
      return;
    }
    
    setLoading(true);
    try {
      setStatus('Approving USDC...');
      const amount = parseUSDC(price);
      const tx = await usdcContract.approve(marketplaceContract.target, amount);
      await tx.wait();
      setStatus(`✅ Approved ${price} USDC!`);
    } catch (error) {
      setStatus(`❌ ${handleTxError(error)}`);
    }
    setLoading(false);
  };

  // Buy NFT
  const handleBuy = async () => {
    if (!marketplaceContract || !tokenId) {
      setStatus('❌ Please enter token ID');
      return;
    }
    
    setLoading(true);
    try {
      setStatus('Buying NFT...');
      const tx = await marketplaceContract.buyItem(tokenId);
      await tx.wait();
      setStatus(`✅ Successfully bought NFT #${tokenId}!`);
    } catch (error) {
      setStatus(`❌ ${handleTxError(error)}`);
    }
    setLoading(false);
  };

  // Get listing info
  const handleGetListing = async () => {
    if (!marketplaceContract || !tokenId) {
      setStatus('❌ Please enter token ID');
      return;
    }
    
    try {
      setStatus('Fetching listing info...');
      const listing = await marketplaceContract.getListing(tokenId);
      const priceFormatted = formatUSDC(listing.price);
      setStatus(`📋 Seller: ${shortenAddress(listing.seller)} | Price: ${priceFormatted} USDC | Active: ${listing.active}`);
    } catch (error) {
      setStatus(`❌ ${handleTxError(error)}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎨 NFT Marketplace</h1>
        
        {!isConnected ? (
          <button onClick={connectWallet} className="connect-btn">
            Connect Wallet
          </button>
        ) : (
          <div className="wallet-info">
            <p>Connected: {shortenAddress(account)}</p>
            {!isCorrectNetwork && (
              <button onClick={switchNetwork} className="switch-network-btn">
                Switch to Polygon
              </button>
            )}
            <button onClick={disconnect} className="disconnect-btn">
              Disconnect
            </button>
          </div>
        )}
      </header>

      {isConnected && isCorrectNetwork && (
        <div className="container">
          <div className="status-box">
            {status && <p>{status}</p>}
          </div>

          {/* Mint NFT Section */}
          <div className="section">
            <h2>🎨 Mint NFT</h2>
            <input
              type="text"
              placeholder="Metadata URI"
              value={metadataUri}
              onChange={(e) => setMetadataUri(e.target.value)}
            />
            <input
              type="text"
              placeholder="NFT Name"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Image URI"
              value={imageUri}
              onChange={(e) => setImageUri(e.target.value)}
            />
            <button onClick={handleMint} disabled={loading}>
              {loading ? 'Minting...' : 'Mint NFT'}
            </button>
          </div>

          {/* List NFT Section */}
          <div className="section">
            <h2>📝 List NFT for Sale</h2>
            <input
              type="text"
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Price (USDC)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <button onClick={handleApprove} disabled={loading}>
              1. Approve Marketplace
            </button>
            <button onClick={handleList} disabled={loading}>
              2. List NFT
            </button>
          </div>

          {/* Buy NFT Section */}
          <div className="section">
            <h2>🛒 Buy NFT</h2>
            <input
              type="text"
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amount (USDC)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <button onClick={handleApproveUSDC} disabled={loading}>
              1. Approve USDC
            </button>
            <button onClick={handleBuy} disabled={loading}>
              2. Buy NFT
            </button>
          </div>

          {/* Get Info Section */}
          <div className="section">
            <h2>ℹ️ Get Listing Info</h2>
            <input
              type="text"
              placeholder="Token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
            <button onClick={handleGetListing} disabled={loading}>
              Get Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
