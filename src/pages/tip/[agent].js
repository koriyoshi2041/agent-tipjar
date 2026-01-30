import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { QRCodeSVG } from 'qrcode.react';
import { USDC_ADDRESS, BLOCK_EXPLORER, BASE_CHAIN_ID } from '@/lib/constants';

// Preset tip amounts in USDC
const PRESET_AMOUNTS = [1, 5, 10, 25];

export default function TipPage() {
  const router = useRouter();
  const { agent, address } = router.query;
  
  const [walletAddress, setWalletAddress] = useState(address || null);
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(null);
  const [copied, setCopied] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate wallet address from agent name if not provided
  useEffect(() => {
    // Wait for router to be ready
    if (!router.isReady) return;
    
    if (agent && !address) {
      fetch('/api/create-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName: agent })
      })
        .then(res => res.json())
        .then(data => {
          setWalletAddress(data.address);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else if (address) {
      setWalletAddress(address);
      setLoading(false);
    }
  }, [router.isReady, agent, address]);

  // Fetch balance when wallet address is available
  useEffect(() => {
    if (walletAddress) {
      fetch(`/api/check-balance?address=${walletAddress}`)
        .then(res => res.json())
        .then(data => setBalance(data))
        .catch(console.error);
    }
  }, [walletAddress]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendTip = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet to send tips!');
      return;
    }

    const tipAmount = parseFloat(amount);
    if (!tipAmount || tipAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setTxStatus('connecting');

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      // Switch to Base network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
        });
      } catch (switchError) {
        // Add Base network if not present
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
              chainName: 'Base',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org'],
            }],
          });
        }
      }

      setTxStatus('sending');

      // USDC transfer (6 decimals)
      const amountInWei = BigInt(Math.floor(tipAmount * 1e6)).toString(16).padStart(64, '0');
      const toAddress = address.slice(2).padStart(64, '0');
      
      // ERC20 transfer function selector: 0xa9059cbb
      const data = `0xa9059cbb${toAddress}${amountInWei}`;

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: USDC_ADDRESS,
          data: data,
        }],
      });

      setTxStatus('success');
      
      // Refresh balance after a delay
      setTimeout(() => {
        fetch(`/api/check-balance?address=${walletAddress}`)
          .then(res => res.json())
          .then(data => setBalance(data))
          .catch(console.error);
      }, 5000);

    } catch (error) {
      console.error('Transaction failed:', error);
      setTxStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const agentDisplayName = agent ? agent.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Agent';

  return (
    <>
      <Head>
        <title>Tip {agentDisplayName} - Agent Tip Jar</title>
        <meta name="description" content={`Send a tip to ${agentDisplayName} via USDC on Base`} />
        <meta property="og:title" content={`Tip ${agentDisplayName}`} />
        <meta property="og:description" content="Send a crypto tip via USDC on Base" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Agent Card */}
          <div className="tip-card text-center">
            {/* Avatar */}
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
              🤖
            </div>
            
            <h1 className="text-2xl font-bold mb-1">{agentDisplayName}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Accepting tips via USDC on Base
            </p>

            {/* Balance Display */}
            {balance && (
              <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Tips Received</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${parseFloat(balance.usdc).toFixed(2)} <span className="text-sm font-normal">USDC</span>
                </p>
              </div>
            )}

            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl inline-block mb-4">
              <QRCodeSVG 
                value={walletAddress} 
                size={160}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Address */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2">Wallet Address (Base Network)</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded font-mono break-all">
                  {walletAddress}
                </code>
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                >
                  {copied ? '✓' : '📋'}
                </button>
              </div>
              <a 
                href={`${BLOCK_EXPLORER}/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline mt-2 inline-block"
              >
                View on BaseScan →
              </a>
            </div>

            {/* Tip Amount Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tip Amount (USDC)
                </label>
                
                {/* Preset Amounts */}
                <div className="flex gap-2 mb-3">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        amount === preset.toString()
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Custom amount"
                    min="0"
                    step="0.01"
                    className="tip-input pl-8"
                  />
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendTip}
                disabled={!amount || txStatus === 'sending'}
                className="tip-button w-full animate-pulse-glow"
              >
                {txStatus === 'connecting' && '🔗 Connecting Wallet...'}
                {txStatus === 'sending' && '⏳ Sending...'}
                {txStatus === 'success' && '✅ Tip Sent!'}
                {txStatus === 'error' && '❌ Failed - Try Again'}
                {!txStatus && `💰 Send $${amount || '0'} Tip`}
              </button>

              {txStatus === 'success' && (
                <p className="text-green-600 text-sm text-center">
                  Thank you for your tip! 🎉
                </p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2">💡 Tips are sent as USDC on Base network</p>
            <p>Need USDC on Base? <a href="https://bridge.base.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bridge here</a></p>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <a href="/" className="text-gray-500 hover:text-gray-700 text-sm">
              ← Create your own tip jar
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
