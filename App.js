import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

export default function App() {
  const [screen, setScreen] = useState('home');
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const connectWallet = () => {
    setLoading(true);
    setTimeout(() => {
      const mockAddress = '0x' + Math.random().toString(16).slice(2, 42);
      setWalletAddress(mockAddress);
      setIsConnected(true);
      setLoading(false);
      setScreen('dashboard');
      Alert.alert('✅ Connected', mockAddress.slice(0, 10) + '...');
    }, 1500);
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
    setScreen('home');
  };

  // HOME SCREEN
  if (screen === 'home' && !isConnected) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
        <ScrollView contentContainerStyle={styles.homeScreen}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Text style={styles.bigEmoji}>🎨</Text>
            <Text style={styles.appName}>CryptoLocker</Text>
            <Text style={styles.appSubtitle}>NFT Marketplace & DeFi Vault</Text>
          </View>

          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionHeader}>✨ Features</Text>
            
            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🖼️</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>NFT Marketplace</Text>
                <Text style={styles.featureDesc}>Buy and sell rare NFTs</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔐</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Token Vault</Text>
                <Text style={styles.featureDesc}>Lock tokens with time-lock</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>💰</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Staking</Text>
                <Text style={styles.featureDesc}>Earn 10% APY rewards</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🔄</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Token Swaps</Text>
                <Text style={styles.featureDesc}>Trade via Uniswap</Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureIcon}>🛡️</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Web3Auth</Text>
                <Text style={styles.featureDesc}>Anti-theft security</Text>
              </View>
            </View>
          </View>

          {/* Connect Button */}
          <TouchableOpacity
            style={styles.connectButton}
            onPress={connectWallet}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" size="large" />
            ) : (
              <>
                <Text style={styles.connectIcon}>🔗</Text>
                <Text style={styles.connectText}>Connect Wallet</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>Connect your Web3 wallet to start</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // DASHBOARD SCREEN
  if (isConnected && screen === 'dashboard') {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#111" />
        
        {/* Header */}
        <View style={styles.dashHeader}>
          <View>
            <Text style={styles.dashTitle}>Dashboard</Text>
            <Text style={styles.dashAddress}>
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </Text>
          </View>
          <TouchableOpacity onPress={disconnectWallet} style={styles.logoutBtn}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.dashContent}>
          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💵</Text>
              <Text style={styles.statValue}>$1,250.50</Text>
              <Text style={styles.statLabel}>USDC Balance</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🖼️</Text>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>NFTs Owned</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setScreen('nft')}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionLabel}>NFTs</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setScreen('vault')}
            >
              <Text style={styles.actionIcon}>🔐</Text>
              <Text style={styles.actionLabel}>Vault</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setScreen('stake')}
            >
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionLabel}>Stake</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setScreen('swap')}
            >
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionLabel}>Swap</Text>
            </TouchableOpacity>
          </View>

          {/* Marketplace */}
          <Text style={styles.sectionTitle}>Marketplace</Text>
          
          <View style={styles.nftCard}>
            <Text style={styles.nftCardEmoji}>🎨</Text>
            <Text style={styles.nftCardTitle}>Rare NFT #101</Text>
            <Text style={styles.nftCardPrice}>25.50 USDC</Text>
            <Text style={styles.nftCardSeller}>by 0xab12...</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nftCard}>
            <Text style={styles.nftCardEmoji}>🎭</Text>
            <Text style={styles.nftCardTitle}>Rare NFT #102</Text>
            <Text style={styles.nftCardPrice}>45.00 USDC</Text>
            <Text style={styles.nftCardSeller}>by 0xcd34...</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.nftCard}>
            <Text style={styles.nftCardEmoji}>🎪</Text>
            <Text style={styles.nftCardTitle}>Rare NFT #103</Text>
            <Text style={styles.nftCardPrice}>60.75 USDC</Text>
            <Text style={styles.nftCardSeller}>by 0xef56...</Text>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // NFT SCREEN
  if (isConnected && screen === 'nft') {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#111" />
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>My NFTs</Text>
          <Text style={styles.screenTitle}> </Text>
        </View>

        <ScrollView style={styles.dashContent}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.myNftCard}>
              <Text style={styles.myNftEmoji}>🎨</Text>
              <View style={styles.myNftInfo}>
                <Text style={styles.myNftTitle}>NFT #{i}</Text>
                <Text style={styles.myNftDesc}>Rare Digital Asset</Text>
              </View>
              <TouchableOpacity style={styles.sellButton}>
                <Text style={styles.sellButtonText}>Sell</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // VAULT SCREEN
  if (isConnected && screen === 'vault') {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#111" />
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>🔐 Token Vault</Text>
          <Text style={styles.screenTitle}> </Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <Text style={styles.screenSubtitle}>Lock your tokens with time-lock security</Text>
          
          <View style={styles.vaultCard}>
            <Text style={styles.vaultIcon}>🔒</Text>
            <Text style={styles.vaultTitle}>Lock USDC Tokens</Text>
            <Text style={styles.vaultAmount}>Lock Amount: 1000 USDC</Text>
            <Text style={styles.vaultDuration}>Duration: 30 days</Text>
            <TouchableOpacity style={styles.actionBtnGreen}>
              <Text style={styles.actionBtnText}>🔐 Lock Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.vaultCard}>
            <Text style={styles.vaultIcon}>✅</Text>
            <Text style={styles.vaultTitle}>Active Locks</Text>
            <Text style={styles.vaultAmount}>You have no active locks</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // STAKE SCREEN
  if (isConnected && screen === 'stake') {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#111" />
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>💰 Staking</Text>
          <Text style={styles.screenTitle}> </Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <Text style={styles.screenSubtitle}>Earn 10% APY on your tokens</Text>
          
          <View style={styles.stakeCard}>
            <Text style={styles.stakeIcon}>📈</Text>
            <Text style={styles.stakeTitle}>USDC Staking</Text>
            <Text style={styles.stakeApy}>APY: 10%</Text>
            <Text style={styles.stakeDesc}>Lock tokens to earn passive rewards</Text>
            <TouchableOpacity style={styles.actionBtnGreen}>
              <Text style={styles.actionBtnText}>💰 Stake 100 USDC</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.stakeCard}>
            <Text style={styles.stakeIcon}>🎁</Text>
            <Text style={styles.stakeTitle}>Your Rewards</Text>
            <Text style={styles.stakeApy}>0 USDC</Text>
            <Text style={styles.stakeDesc}>Claim rewards anytime</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // SWAP SCREEN
  if (isConnected && screen === 'swap') {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#111" />
        <View style={styles.screenHeader}>
          <TouchableOpacity onPress={() => setScreen('dashboard')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>🔄 Swap</Text>
          <Text style={styles.screenTitle}> </Text>
        </View>

        <ScrollView style={styles.dashContent}>
          <Text style={styles.screenSubtitle}>Trade tokens via Uniswap</Text>
          
          <View style={styles.swapCard}>
            <Text style={styles.swapLabel}>From</Text>
            <TextInput
              style={styles.swapInput}
              placeholder="0.0"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
            <Text style={styles.swapToken}>USDC</Text>
          </View>

          <View style={styles.swapArrow}>
            <Text style={styles.swapArrowIcon}>⬇️</Text>
          </View>

          <View style={styles.swapCard}>
            <Text style={styles.swapLabel}>To</Text>
            <TextInput
              style={styles.swapInput}
              placeholder="0.0"
              placeholderTextColor="#666"
              editable={false}
            />
            <Text style={styles.swapToken}>MATIC</Text>
          </View>

          <TouchableOpacity style={styles.actionBtnGreen}>
            <Text style={styles.actionBtnText}>Swap Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#0a0a0a' },
  
  // HOME SCREEN
  homeScreen: { padding: 20, paddingVertical: 40 },
  logoSection: { alignItems: 'center', marginBottom: 40 },
  bigEmoji: { fontSize: 100, marginBottom: 10 },
  appName: { fontSize: 36, fontWeight: 'bold', color: '#10b981', marginBottom: 5 },
  appSubtitle: { fontSize: 14, color: '#999' },
  
  featuresSection: { marginBottom: 40 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#10b981', marginBottom: 15 },
  featureCard: { backgroundColor: '#111', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  featureIcon: { fontSize: 32, marginRight: 15 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 2 },
  featureDesc: { fontSize: 12, color: '#666' },
  
  connectButton: { backgroundColor: '#10b981', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  connectIcon: { fontSize: 32, marginBottom: 8 },
  connectText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  disclaimer: { textAlign: 'center', color: '#666', fontSize: 12 },
  
  // DASHBOARD
  dashHeader: { backgroundColor: '#111', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#222' },
  dashTitle: { fontSize: 24, fontWeight: 'bold', color: '#10b981' },
  dashAddress: { fontSize: 12, color: '#666', marginTop: 5 },
  logoutBtn: { padding: 10 },
  logoutIcon: { fontSize: 24 },
  
  dashContent: { flex: 1, padding: 15 },
  
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  statCard: { flex: 1, backgroundColor: '#111', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  statIcon: { fontSize: 32, marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#10b981', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#666', textAlign: 'center' },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#10b981', marginTop: 20, marginBottom: 12 },
  
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  actionButton: { width: '48%', backgroundColor: '#111', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  actionIcon: { fontSize: 32, marginBottom: 5 },
  actionLabel: { fontSize: 12, color: '#fff', fontWeight: '500' },
  
  nftCard: { backgroundColor: '#111', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  nftCardEmoji: { fontSize: 40, marginBottom: 8 },
  nftCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  nftCardPrice: { fontSize: 16, fontWeight: 'bold', color: '#10b981', marginBottom: 4 },
  nftCardSeller: { fontSize: 11, color: '#666', marginBottom: 10 },
  buyButton: { backgroundColor: '#10b981', padding: 10, borderRadius: 6, alignItems: 'center' },
  buyButtonText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  
  // SCREENS
  screenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#111', padding: 15, borderBottomWidth: 1, borderBottomColor: '#222' },
  backButton: { color: '#10b981', fontWeight: 'bold', fontSize: 14 },
  screenTitle: { fontSize: 18, fontWeight: 'bold', color: '#10b981' },
  screenSubtitle: { fontSize: 13, color: '#666', marginBottom: 15, textAlign: 'center' },
  
  myNftCard: { backgroundColor: '#111', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  myNftEmoji: { fontSize: 40, marginRight: 12 },
  myNftInfo: { flex: 1 },
  myNftTitle: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  myNftDesc: { fontSize: 12, color: '#666' },
  sellButton: { backgroundColor: '#222', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#10b981' },
  sellButtonText: { color: '#10b981', fontWeight: 'bold', fontSize: 12 },
  
  vaultCard: { backgroundColor: '#111', padding: 20, borderRadius: 10, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  vaultIcon: { fontSize: 48, marginBottom: 10 },
  vaultTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  vaultAmount: { fontSize: 14, color: '#10b981', marginBottom: 5 },
  vaultDuration: { fontSize: 12, color: '#666', marginBottom: 15 },
  
  stakeCard: { backgroundColor: '#111', padding: 20, borderRadius: 10, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  stakeIcon: { fontSize: 48, marginBottom: 10 },
  stakeTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  stakeApy: { fontSize: 14, color: '#10b981', marginBottom: 5 },
  stakeDesc: { fontSize: 12, color: '#666', marginBottom: 15, textAlign: 'center' },
  
  swapCard: { backgroundColor: '#111', padding: 15, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#222' },
  swapLabel: { fontSize: 12, color: '#666', marginBottom: 8 },
  swapInput: { backgroundColor: '#0a0a0a', color: '#fff', fontSize: 18, fontWeight: 'bold', padding: 10, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#222' },
  swapToken: { fontSize: 12, color: '#10b981', fontWeight: 'bold' },
  swapArrow: { alignItems: 'center', marginVertical: 10 },
  swapArrowIcon: { fontSize: 28 },
  
  actionBtnGreen: { backgroundColor: '#10b981', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  actionBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 }
});
