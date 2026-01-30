import { getUSDCBalance, getETHBalance, isValidAddress } from '@/lib/wallet';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    if (!isValidAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    // Fetch balances in parallel
    const [usdc, eth] = await Promise.all([
      getUSDCBalance(address),
      getETHBalance(address),
    ]);

    return res.status(200).json({
      address,
      usdc,
      eth,
      network: 'base',
    });

  } catch (error) {
    console.error('Error checking balance:', error);
    return res.status(500).json({ error: 'Failed to check balance' });
  }
}
