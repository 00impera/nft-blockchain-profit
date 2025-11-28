import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { fetchUserData } from '../utils/web3';

export default function DashboardScreen({ walletAddress, onDisconnect }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    nftBalance: 0,
    usdcBalance: 0,
    pendingEarnings: 0,
  });

  useEffect(() => {
    loadData();
  }, [walletAddress]);

  const loadData = async () => {
    try {
      setLoading(true);
      const userData = await fetchUserData(walletAddress);
      setData(userData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔒 CryptoLocker</Text>
        <Text style={styles.subtitle}>NFT Blockchain Profit</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Wallet Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>💼 Wallet Connected</Text>
          <Text style={styles.walletAddress}>
            {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
          </Text>
          <TouchableOpacity 
            style={styles.copyButton}
            onPress={() => Alert.alert('Address Copied', walletAddress)}
          >
            <Text style={styles.copyButtonText}>📋 Copy Full Address</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.loadingText}>Fetching blockchain data...</Text>
          </View>
        ) : (
          <>
            {/* Balance Cards */}
            <View style={styles.balanceRow}>
              <View style={[styles.balanceCard, styles.balanceCard1]}>
                <Text style={styles.balanceLabel}>💵 USDC Balance</Text>
                <Text style={styles.balanceValue}>${data.usdcBalance.toFixed(2)}</Text>
              </View>
              <View style={[styles.balanceCard, styles.balanceCard2]}>
                <Text style={styles.balanceLabel}>🎨 NFTs Owned</Text>
                <Text style={styles.balanceValue}>{data.nftBalance}</Text>
              </View>
            </View>

            {/* Earnings Card */}
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>💰 Pending Earnings</Text>
              <Text style={styles.earningsValue}>${data.pendingEarnings.toFixed(2)}</Text>
              <Text style={styles.earningsDescription}>
                Available to withdraw from marketplace sales
              </Text>
              <TouchableOpacity 
                style={styles.withdrawButton}
                onPress={() => Alert.alert('Coming Soon', 'Withdraw feature will be added in next update')}
              >
                <Text style={styles.withdrawButtonText}>🏦 Withdraw Earnings</Text>
              </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={() => Alert.alert('Coming Soon', 'NFT Minting feature coming next!')}
              >
                <Text style={styles.buttonText}>🎨 Mint NFT</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={() => Alert.alert('Coming Soon', 'Marketplace browse coming next!')}
              >
                <Text style={styles.buttonText}>🛒 Marketplace</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📊 Network Stats</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Network:</Text>
                <Text style={styles.statValue}>Polygon (137)</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Platform Fee:</Text>
                <Text style={styles.statValue}>2%</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Last Updated:</Text>
                <Text style={styles.statValue}>{new Date().toLocaleTimeString()}</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚡ Quick Actions</Text>
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => Alert.alert('Coming Soon', 'View your NFT collection')}
              >
                <Text style={styles.actionText}>🖼️ View My NFTs</Text>
                <Text style={styles.actionArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => Alert.alert('Coming Soon', 'View transaction history')}
              >
                <Text style={styles.actionText}>📜 Transaction History</Text>
                <Text style={styles.actionArrow}>›</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => Alert.alert('Coming Soon', 'Check active listings')}
              >
                <Text style={styles.actionText}>🏷️ My Listings</Text>
                <Text style={styles.actionArrow}>›</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Disconnect Button */}
        <TouchableOpacity style={styles.disconnectButton} onPress={onDisconnect}>
          <Text style={styles.disconnectButtonText}>🚪 Disconnect Wallet</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#e0e0ff',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  walletAddress: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  copyButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  copyButtonText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  balanceRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  balanceCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceCard1: {
    backgroundColor: '#4CAF50',
  },
  balanceCard2: {
    backgroundColor: '#FF9800',
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 8,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  earningsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  earningsDescription: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
    textAlign: 'center',
  },
  withdrawButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: '#6200ee',
  },
  secondaryButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    color: '#999',
    fontSize: 14,
  },
  statValue: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  actionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
  actionArrow: {
    fontSize: 20,
    color: '#999',
  },
  disconnectButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disconnectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  spacer: {
    height: 20,
  },
});
