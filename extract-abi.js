// extract-abi.js
// Extract clean ABIs from the raw PolygonScan responses

const fs = require('fs');

function extractABI(inputFile, outputFile, contractName) {
  try {
    console.log(`\n📖 Reading ${inputFile}...`);
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const response = JSON.parse(rawData);
    
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.message}`);
    
    if (response.status === '1' && response.result) {
      let abi;
      
      // Handle both string and object responses
      if (typeof response.result === 'string') {
        abi = JSON.parse(response.result);
      } else {
        abi = response.result;
      }
      
      // Save clean ABI
      fs.writeFileSync(outputFile, JSON.stringify(abi, null, 2));
      
      console.log(`✅ ${contractName} ABI extracted successfully!`);
      console.log(`   Functions/Events: ${abi.length}`);
      console.log(`   Saved to: ${outputFile}`);
      
      // Show first few items to verify
      console.log(`   First item: ${abi[0].type} - ${abi[0].name || 'constructor'}`);
      
      return true;
    } else {
      console.error(`❌ Error: ${response.message || 'Unknown error'}`);
      console.error(`   Result: ${response.result}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${inputFile}:`, error.message);
    return false;
  }
}

console.log('🔧 Extracting ABIs from raw responses...');

const nftSuccess = extractABI('nft-abi-raw.json', 'nft-abi.json', 'NFT Contract');
const marketplaceSuccess = extractABI('marketplace-abi-raw.json', 'marketplace-abi.json', 'Marketplace Contract');

if (nftSuccess && marketplaceSuccess) {
  console.log('\n✨ SUCCESS! Both ABIs extracted!\n');
  console.log('📁 Clean ABI files created:');
  console.log('   • nft-abi.json');
  console.log('   • marketplace-abi.json\n');
  console.log('💡 Next steps:');
  console.log('   1. Create a contracts folder: mkdir -p src/contracts');
  console.log('   2. Move ABIs there: mv *-abi.json src/contracts/');
  console.log('   3. Import in your React app:');
  console.log('      import NFT_ABI from "./contracts/nft-abi.json";');
  console.log('      import MARKETPLACE_ABI from "./contracts/marketplace-abi.json";\n');
} else {
  console.log('\n❌ Some ABIs failed to extract. Check errors above.');
  process.exit(1);
}
