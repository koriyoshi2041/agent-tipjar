import { generateDeterministicWallet } from '@/lib/wallet';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { agentName, secret } = req.body;

    if (!agentName || typeof agentName !== 'string') {
      return res.status(400).json({ error: 'Agent name is required' });
    }

    // Sanitize agent name
    const sanitizedName = agentName.trim().toLowerCase();
    
    if (sanitizedName.length < 2) {
      return res.status(400).json({ error: 'Agent name must be at least 2 characters' });
    }

    if (sanitizedName.length > 50) {
      return res.status(400).json({ error: 'Agent name must be less than 50 characters' });
    }

    // Generate deterministic wallet
    const wallet = generateDeterministicWallet(sanitizedName, secret || '');

    // Return only the address (NEVER expose private key via API)
    return res.status(200).json({
      address: wallet.address,
      agentName: sanitizedName,
      note: 'To access the private key, run: npm run generate-wallet -- --name "' + sanitizedName + '"'
    });

  } catch (error) {
    console.error('Error creating wallet:', error);
    return res.status(500).json({ error: 'Failed to create wallet' });
  }
}
