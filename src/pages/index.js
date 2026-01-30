import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [agentName, setAgentName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [mode, setMode] = useState('deterministic'); // 'deterministic' or 'custom'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    
    if (mode === 'deterministic') {
      if (!agentName.trim()) {
        setError('Please enter an agent name');
        return;
      }
      setLoading(true);
      
      try {
        const res = await fetch('/api/create-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ agentName: agentName.trim() }),
        });
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          const slug = agentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
          setGeneratedUrl(`${window.location.origin}/tip/${slug}?address=${data.address}`);
        }
      } catch (err) {
        setError('Failed to generate wallet');
      }
      
      setLoading(false);
    } else {
      if (!walletAddress.trim()) {
        setError('Please enter a wallet address');
        return;
      }
      
      // Validate address format
      if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress.trim())) {
        setError('Invalid Ethereum address format');
        return;
      }
      
      const slug = agentName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'my-agent';
      setGeneratedUrl(`${window.location.origin}/tip/${slug}?address=${walletAddress.trim()}`);
    }
  };

  return (
    <>
      <Head>
        <title>Agent Tip Jar - Accept crypto tips for your AI agent</title>
        <meta name="description" content="The simplest tip jar for AI agents. Accept USDC on Base with zero friction." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🤖 Agent Tip Jar
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              The simplest way for AI agents to accept tips
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              USDC on Base • Low gas • No signup required
            </p>
          </div>

          {/* Generator Card */}
          <div className="tip-card max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Create Your Tip Jar</h2>
            
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMode('deterministic')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  mode === 'deterministic'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                🎲 Generate New Wallet
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  mode === 'custom'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                📝 Use Existing Address
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agent Name
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="e.g., Claude, GPT-4, my-assistant"
                  className="tip-input"
                />
              </div>

              {mode === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Wallet Address (Base)
                  </label>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x..."
                    className="tip-input font-mono text-sm"
                  />
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="tip-button w-full"
              >
                {loading ? 'Generating...' : 'Generate Tip Jar Link'}
              </button>
            </div>

            {/* Generated URL */}
            {generatedUrl && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  ✅ Your Tip Jar is ready!
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 rounded border text-sm font-mono"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedUrl)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                  >
                    Copy
                  </button>
                </div>
                <Link 
                  href={generatedUrl.replace(window.location.origin, '')}
                  className="block mt-3 text-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  Preview your tip jar →
                </Link>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-semibold mb-2">Low Gas Fees</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Built on Base L2. Tips cost less than $0.01 in gas.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="font-semibold mb-2">Embeddable</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Add a tip button to any website with one line of code.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="font-semibold mb-2">Self-Custody</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You control the wallet. No intermediaries.
              </p>
            </div>
          </div>

          {/* Embed Code Section */}
          <div className="mt-16 tip-card">
            <h2 className="text-xl font-semibold mb-4">📦 Embed in Your Project</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Add a tip button to your website or agent interface:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`<!-- Add to your HTML -->
<a href="https://your-domain.com/tip/your-agent?address=0x..."
   target="_blank"
   style="display:inline-block;padding:12px 24px;background:#0052FF;color:white;border-radius:8px;text-decoration:none;font-weight:600;">
  💰 Tip this Agent
</a>`}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-16 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>Open source. MIT License.</p>
            <p className="mt-2">
              <a href="https://github.com" className="hover:text-gray-700 dark:hover:text-gray-300">GitHub</a>
              {' • '}
              <a href="https://base.org" className="hover:text-gray-700 dark:hover:text-gray-300">Built on Base</a>
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
