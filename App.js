import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';

let ethers, ADDRESSES, NETWORK, USDC_DECIMALS, NFT_ABI, MARKETPLACE_ABI, USDC_ABI;
try {
  require('react-native-get-random-values');
  require('@ethersproject/shims');
  ethers = require('ethers');
  const a = require('./src/contracts/addresses');
  const b = require('./src/contracts/abis');
  ADDRESSES = a.ADDRESSES;
  NETWORK = a.NETWORK;
  USDC_DECIMALS = a.USDC_DECIMALS;
  NFT_ABI = b.NFT_ABI;
  MARKETPLACE_ABI = b.MARKETPLACE_ABI;
  USDC_ABI = b.USDC_ABI;
} catch (e) { console.log(e); }

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState('');
  const [connected, setConnected] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('market');
  const [price, setPrice] = useState('');
  const [selected, setSelected] = useState(null);
  const [balance, setBalance] = useState('0');
  const [profit, setProfit] = useState('0');

  useEffect(() => {
    if (NETWORK?.RPC_URL) {
      const p = new ethers.providers.JsonRpcProvider(NETWORK.RPC_URL);
      setProvider(p);
    }
  }, []);

  const getContracts = (s = signer) => {
    if (!s) return null;
    return {
      nft: new ethers.Contract(ADDRESSES.NFT, NFT_ABI, s),
      market: new ethers.Contract(ADDRESSES.MARKETPLACE, MARKETPLACE_ABI, s),
      usdc: new ethers.Contract(ADDRESSES.USDC, USDC_ABI, s)
    };
  };

  const connect = () => {
    Alert.prompt('Wallet', 'Enter address:', async (addr) => {
      if (ethers.utils.isAddress(addr)) {
        setAddress(addr);
        const w = ethers.Wallet.createRandom().connect(provider);
        setSigner(w);
        setConnected(true);
        loadAll(w, addr);
      } else Alert.alert('Error', 'Invalid address');
    });
  };

  const loadAll = async (s = signer, a = address) => {
    if (!s) return;
    setLoading(true);
    try {
      const c = getContracts(s);
      
      // Load NFTs
      const bal = await c.nft.balanceOf(a);
      const myNfts = [];
      for (let i = 0; i < bal.toNumber(); i++) {
        const id = await c.nft.tokenOfOwnerByIndex(a, i);
        myNfts.push({ id: id.toString(), name: `NFT #${id}` });
      }
      setNfts(myNfts);

      // Load Listings
      const all = await c.market.getAllListings();
      const list = [];
      for (let id of all) {
        const l = await c.market.getListing(id);
        if (l.isActive) {
          list.push({
            id: id.toString(),
            seller: l.seller,
            price: ethers.utils.formatUnits(l.price, USDC_DECIMALS),
            name: `NFT #${id}`
          });
        }
      }
      setListings(list);

      // Load USDC Balance
      const usdcBal = await c.usdc.balanceOf(a);
      setBalance(ethers.utils.formatUnits(usdcBal, USDC_DECIMALS));

      // Calculate profit (simplified)
      setProfit('0.00');
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const listNFT = async (id) => {
    if (!price || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Enter valid price');
      return;
    }
    setLoading(true);
    try {
      const c = getContracts();
      const tx1 = await c.nft.approve(ADDRESSES.MARKETPLACE, id);
      await tx1.wait();
      const p = ethers.utils.parseUnits(price, USDC_DECIMALS);
      const tx2 = await c.market.listNFT(id, p);
      await tx2.wait();
      Alert.alert('Success', `Listed for ${price} USDC`);
      setPrice('');
      setSelected(null);
      loadAll();
    } catch (e) {
      Alert.alert('Error', e.message);
    }
    setLoading(false);
  };

  const buyNFT = async (id, p) => {
    Alert.alert('Buy', `Buy for ${p} USDC?`, [
      { text: 'No' },
      {
        text: 'Yes', onPress: async () => {
          setLoading(true);
          try {
            const c = getContracts();
            const amt = ethers.utils.parseUnits(p, USDC_DECIMALS);
            const tx1 = await c.usdc.approve(ADDRESSES.MARKETPLACE, amt);
            await tx1.wait();
            const tx2 = await c.market.buyNFT(id);
            await tx2.wait();
            Alert.alert('Success', 'Purchased!');
            loadAll();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
          setLoading(false);
        }
      }
    ]);
  };

  const cancelList = async (id) => {
    Alert.alert('Cancel', 'Cancel listing?', [
      { text: 'No' },
      {
        text: 'Yes', onPress: async () => {
          setLoading(true);
          try {
            const c = getContracts();
            const tx = await c.market.cancelListing(id);
            await tx.wait();
            Alert.alert('Success', 'Cancelled');
            loadAll();
          } catch (e) {
            Alert.alert('Error', e.message);
          }
          setLoading(false);
        }
      }
    ]);
  };

  if (!ethers) {
    return (
      <View style={s.container}>
        <Text style={s.error}>Web3 not loaded{'\n'}Run: npm install</Text>
      </View>
    );
  }

  if (!connected) {
    return (
      <View style={s.container}>
        <StatusBar style="light" />
        <Text style={s.logo}>🎨</Text>
        <Text style={s.title}>NFT Marketplace</Text>
        <TouchableOpacity style={s.btn} onPress={connect}>
          <Text style={s.btnText}>Connect</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <StatusBar style="light" />
      
      <View style={s.header}>
        <Text style={s.h1}>Dashboard</Text>
        <Text style={s.addr}>{address.slice(0,6)}...{address.slice(-4)}</Text>
      </View>

      <View style={s.stats}>
        <View style={s.stat}>
          <Text style={s.statVal}>{balance}</Text>
          <Text style={s.statLbl}>USDC</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.statVal}>{nfts.length}</Text>
          <Text style={s.statLbl}>NFTs</Text>
        </View>
        <View style={s.stat}>
          <Text style={[s.statVal, s.green]}>+{profit}</Text>
          <Text style={s.statLbl}>Profit</Text>
        </View>
      </View>

      <View style={s.tabs}>
        <TouchableOpacity style={[s.tab, tab === 'market' && s.tabActive]} onPress={() => setTab('market')}>
          <Text style={[s.tabTxt, tab === 'market' && s.tabTxtActive]}>Market</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tab, tab === 'my' && s.tabActive]} onPress={() => setTab('my')}>
          <Text style={[s.tabTxt, tab === 'my' && s.tabTxtActive]}>My NFTs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={loadAll} />}>
        {tab === 'market' && (
          listings.length === 0 ? (
            <Text style={s.empty}>No listings</Text>
          ) : (
            listings.map(l => (
              <View key={l.id} style={s.card}>
                <Text style={s.cardTitle}>{l.name}</Text>
                <Text style={s.cardPrice}>{l.price} USDC</Text>
                <Text style={s.cardInfo}>Seller: {l.seller.slice(0,6)}...</Text>
                <TouchableOpacity style={s.buyBtn} onPress={() => buyNFT(l.id, l.price)}>
                  <Text style={s.buyBtnTxt}>Buy</Text>
                </TouchableOpacity>
              </View>
            ))
          )
        )}

        {tab === 'my' && (
          nfts.length === 0 ? (
            <Text style={s.empty}>No NFTs</Text>
          ) : (
            nfts.map(n => (
              <View key={n.id} style={s.card}>
                <Text style={s.cardTitle}>{n.name}</Text>
                {selected === n.id ? (
                  <View>
                    <TextInput
                      style={s.input}
                      placeholder="Price"
                      keyboardType="numeric"
                      value={price}
                      onChangeText={setPrice}
                      placeholderTextColor="#666"
                    />
                    <View style={s.row}>
                      <TouchableOpacity style={s.cancelBtn} onPress={() => { setSelected(null); setPrice(''); }}>
                        <Text style={s.cancelTxt}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={s.listBtn} onPress={() => listNFT(n.id)}>
                        <Text style={s.listTxt}>List</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity style={s.sellBtn} onPress={() => setSelected(n.id)}>
                    <Text style={s.sellBtnTxt}>Sell</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  logo: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 24, color: '#10b981', fontWeight: 'bold', marginBottom: 30 },
  btn: { backgroundColor: '#10b981', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 8 },
  btnText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
  error: { color: '#ef4444', textAlign: 'center', padding: 20 },
  header: { backgroundColor: '#111', padding: 20, paddingTop: 50, width: '100%', borderBottomWidth: 1, borderBottomColor: '#10b981' },
  h1: { fontSize: 22, color: '#10b981', fontWeight: 'bold' },
  addr: { fontSize: 12, color: '#666', marginTop: 5 },
  stats: { flexDirection: 'row', backgroundColor: '#111', padding: 15, width: '100%' },
  stat: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  statLbl: { fontSize: 10, color: '#666', marginTop: 2 },
  green: { color: '#10b981' },
  tabs: { flexDirection: 'row', backgroundColor: '#111', width: '100%', borderBottomWidth: 1, borderBottomColor: '#222' },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#10b981' },
  tabTxt: { color: '#666', fontSize: 13, fontWeight: '600' },
  tabTxtActive: { color: '#10b981' },
  content: { flex: 1, width: '100%' },
  empty: { color: '#666', textAlign: 'center', marginTop: 40, fontSize: 14 },
  card: { backgroundColor: '#111', margin: 10, padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#222' },
  cardTitle: { fontSize: 16, color: '#fff', fontWeight: 'bold', marginBottom: 5 },
  cardPrice: { fontSize: 18, color: '#10b981', fontWeight: 'bold', marginBottom: 5 },
  cardInfo: { fontSize: 11, color: '#666', marginBottom: 10 },
  buyBtn: { backgroundColor: '#10b981', padding: 10, borderRadius: 6, alignItems: 'center' },
  buyBtnTxt: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  sellBtn: { backgroundColor: '#222', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 5 },
  sellBtnTxt: { color: '#10b981', fontWeight: 'bold' },
  input: { backgroundColor: '#222', color: '#fff', padding: 10, borderRadius: 6, marginBottom: 8, borderWidth: 1, borderColor: '#10b981' },
  row: { flexDirection: 'row', gap: 8 },
  cancelBtn: { flex: 1, backgroundColor: '#222', padding: 10, borderRadius: 6, alignItems: 'center' },
  cancelTxt: { color: '#666', fontWeight: 'bold' },
  listBtn: { flex: 1, backgroundColor: '#10b981', padding: 10, borderRadius: 6, alignItems: 'center' },
  listTxt: { color: '#000', fontWeight: 'bold' }
});
