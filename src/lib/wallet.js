import { ethers } from 'ethers';
import { BASE_RPC_URL, USDC_ADDRESS, ERC20_ABI, USDC_DECIMALS } from './constants';

/**
 * Generate a deterministic wallet from agent name
 * Uses keccak256 hash of the name as the private key seed
 * 
 * WARNING: This is for demo purposes. In production, use proper key management!
 * 
 * @param {string} agentName - Unique agent identifier
 * @param {string} secret - Optional secret salt for additional security
 * @returns {object} - { address, privateKey }
 */
export function generateDeterministicWallet(agentName, secret = '') {
  const seed = `agent-tipjar:${agentName}:${secret}`;
  const hash = ethers.keccak256(ethers.toUtf8Bytes(seed));
  const wallet = new ethers.Wallet(hash);
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

/**
 * Create a new random wallet
 * 
 * @returns {object} - { address, privateKey, mnemonic }
 */
export function createRandomWallet() {
  const wallet = ethers.Wallet.createRandom();
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase,
  };
}

/**
 * Get USDC balance for an address
 * 
 * @param {string} address - Wallet address
 * @returns {Promise<string>} - Balance in USDC (formatted)
 */
export async function getUSDCBalance(address) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const usdc = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, provider);
    const balance = await usdc.balanceOf(address);
    return ethers.formatUnits(balance, USDC_DECIMALS);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
}

/**
 * Get ETH balance for an address (for gas)
 * 
 * @param {string} address - Wallet address
 * @returns {Promise<string>} - Balance in ETH (formatted)
 */
export async function getETHBalance(address) {
  try {
    const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return '0';
  }
}

/**
 * Validate Ethereum address
 * 
 * @param {string} address 
 * @returns {boolean}
 */
export function isValidAddress(address) {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
}
