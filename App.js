import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnect = (address) => {
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
  };

  return (
    <>
      <StatusBar style="light" />
      {walletAddress ? (
        <DashboardScreen
          walletAddress={walletAddress}
          onDisconnect={handleDisconnect}
        />
      ) : (
        <LoginScreen onConnect={handleConnect} />
      )}
    </>
  );
}
