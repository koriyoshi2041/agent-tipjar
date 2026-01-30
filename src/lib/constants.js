// Base Mainnet
export const BASE_CHAIN_ID = 8453;
export const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';

// USDC on Base
export const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const USDC_DECIMALS = 6;

// ERC20 ABI (minimal for balance checking and transfer)
export const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function transfer(address to, uint256 amount) returns (bool)',
];

// Base block explorer
export const BLOCK_EXPLORER = 'https://basescan.org';
