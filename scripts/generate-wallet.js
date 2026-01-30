#!/usr/bin/env node

/**
 * CLI tool to generate a wallet for an agent
 * 
 * Usage:
 *   node scripts/generate-wallet.js --name "my-agent"
 *   node scripts/generate-wallet.js --name "my-agent" --secret "optional-secret"
 *   node scripts/generate-wallet.js --random
 */

const { ethers } = require('ethers');

// Parse arguments
const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : null;
};

const agentName = getArg('--name');
const secret = getArg('--secret') || '';
const isRandom = args.includes('--random');

console.log('\n🤖 Agent Tip Jar - Wallet Generator\n');
console.log('=' .repeat(50));

if (isRandom) {
  // Generate random wallet
  const wallet = ethers.Wallet.createRandom();
  
  console.log('\n📝 New Random Wallet Generated:\n');
  console.log(`Address:     ${wallet.address}`);
  console.log(`Private Key: ${wallet.privateKey}`);
  console.log(`Mnemonic:    ${wallet.mnemonic?.phrase}`);
  
} else if (agentName) {
  // Generate deterministic wallet
  const sanitizedName = agentName.trim().toLowerCase();
  const seed = `agent-tipjar:${sanitizedName}:${secret}`;
  const hash = ethers.keccak256(ethers.toUtf8Bytes(seed));
  const wallet = new ethers.Wallet(hash);
  
  console.log(`\n📝 Wallet for "${sanitizedName}":\n`);
  console.log(`Address:     ${wallet.address}`);
  console.log(`Private Key: ${wallet.privateKey}`);
  
  if (secret) {
    console.log(`\n🔐 Secret used: ${secret}`);
  }
  
} else {
  console.log('\nUsage:');
  console.log('  Generate deterministic wallet:');
  console.log('    node scripts/generate-wallet.js --name "my-agent"');
  console.log('    node scripts/generate-wallet.js --name "my-agent" --secret "my-secret"');
  console.log('\n  Generate random wallet:');
  console.log('    node scripts/generate-wallet.js --random');
  process.exit(1);
}

console.log('\n' + '=' .repeat(50));
console.log('\n⚠️  IMPORTANT: Keep your private key safe!');
console.log('    Never share it or commit it to version control.\n');
console.log('💡 Tip: Import this wallet into MetaMask to withdraw tips.');
console.log('    Network: Base (Chain ID: 8453)');
console.log('    RPC: https://mainnet.base.org\n');
