import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { isValidAddress } from '../utils/web3';

export default function LoginScreen({ onConnect }) {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handleConnect = async () => {
    if (!address) {
      Alert.alert('Error', 'Please enter a wallet address');
      return;
    }

    if (!isValidAddress(address)) {
      Alert.alert('Error', 'Invalid Ethereum address format');
      return;
    }

    setLoading(true);
    try {
      onConnect(address);
      Alert.alert('✅ Connected', `Wallet: ${address.slice(0, 6)}...${address.slice(-4)}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔒 CryptoLocker</Text>
        <Text style={styles.subtitle}>NFT Blockchain Profit</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.descriptionText}>
          Enter your Polygon wallet address to track your NFTs and earnings
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter wallet address (0x...)"
          placeholderTextColor="#999"
          value={address}
          onChangeText={setAddress}
          editable={!loading}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={[styles.connectButton, loading && styles.buttonDisabled]}
          onPress={handleConnect}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.connectButtonText}>🔌 Connect Wallet</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Network Info:</Text>
          <Text style={styles.infoText}>• Network: Polygon Mainnet</Text>
          <Text style={styles.infoText}>• Chain ID: 137</Text>
          <Text style={styles.infoText}>• RPC: https://polygon-rpc.com</Text>
        </View>

        <View style={styles.exampleBox}>
          <Text style={styles.exampleTitle}>💡 Try with example address:</Text>
          <TouchableOpacity onPress={() => setAddress('0x592B35c8917eD36c39Ef73D0F5e92B0173560b2e')}>
            <Text style={styles.exampleAddress}>0x592B35c8917eD36c39Ef73D0F5e92B0173560b2e</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 32,
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
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  connectButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
    padding: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    color: '#666',
    fontSize: 12,
    marginVertical: 3,
  },
  exampleBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  exampleTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  exampleAddress: {
    color: '#6200ee',
    fontSize: 12,
    fontFamily: 'monospace',
    textDecorationLine: 'underline',
  },
});
