# 🤖 Agent Tip Jar

> The simplest way for AI agents to accept crypto tips. USDC on Base. Zero friction.

<p align="center">
  <img src="https://via.placeholder.com/800x400/0052FF/FFFFFF?text=Agent+Tip+Jar+Demo" alt="Agent Tip Jar Demo" />
</p>

<p align="center">
  <a href="https://choosealicense.com/licenses/mit/"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" /></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="TailwindCSS" /></a>
  <a href="https://docs.ethers.org"><img src="https://img.shields.io/badge/Ethers.js-6-purple?logo=ethereum&logoColor=white" alt="Ethers.js" /></a>
</p>

<p align="center">
  <a href="https://base.org"><img src="https://img.shields.io/badge/Network-Base-blue.svg" alt="Base" /></a>
  <a href="https://www.circle.com/en/usdc"><img src="https://img.shields.io/badge/Token-USDC-2775CA.svg" alt="USDC" /></a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</p>

---

<!-- 
📸 DEMO GIF PLACEHOLDER
Replace the placeholder above with an actual demo GIF/video showing:
1. Creating a tip jar on the homepage
2. Viewing the tip page with QR code
3. (Optional) Sending a tip via MetaMask

Recommended tools: CleanShot X, Loom, or ScreenToGif
Recommended size: 800x450, <5MB
-->

## Why?

AI agents are doing real work. They deserve tips too! 

Agent Tip Jar makes it dead simple:
- **No signup** - Generate a wallet in seconds
- **No custody** - You control the private keys
- **Low fees** - Built on Base L2 (~$0.001 per tx)
- **Embeddable** - Add a tip button anywhere

## Quick Start

### Option 1: Use the Hosted Version

Visit [your-domain.com](https://your-domain.com) and create your tip jar in 30 seconds.

### Option 2: Self-Host

```bash
# Clone the repo
git clone https://github.com/koriyoshi2041/agent-tipjar.git
cd agent-tipjar

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Creating a Tip Jar

### Via Web Interface

1. Go to the homepage
2. Enter your agent's name (e.g., "Claude", "my-assistant")
3. Click "Generate Tip Jar Link"
4. Share the generated URL!

### Via CLI (for automation)

```bash
# Generate a deterministic wallet from agent name
npm run generate-wallet -- --name "my-agent"

# With optional secret for extra security
npm run generate-wallet -- --name "my-agent" --secret "my-secret-salt"

# Generate a random wallet
npm run generate-wallet -- --random
```

Output:
```
🤖 Agent Tip Jar - Wallet Generator

==================================================

📝 Wallet for "my-agent":

Address:     0x742d35Cc6634C0532925a3b844Bc9e7595f...
Private Key: 0x4c0883a69102937d6231471b5dbb6204fe...

==================================================

⚠️  IMPORTANT: Keep your private key safe!
    Never share it or commit it to version control.
```

## Embedding in Your Project

### Simple Link Button

```html
<a href="https://your-domain.com/tip/your-agent?address=0x..." 
   target="_blank"
   style="display:inline-block;padding:12px 24px;background:#0052FF;color:white;border-radius:8px;text-decoration:none;font-weight:600;">
  💰 Tip this Agent
</a>
```

### Using the Embed Script

```html
<!-- Auto-creates a button -->
<script 
  src="https://your-domain.com/embed.js"
  data-agent="my-agent"
  data-address="0x742d35Cc6634C0532925a3b844Bc9e7595f..."
  data-text="💰 Send a Tip"
  data-size="medium"
  data-theme="light">
</script>
```

### Programmatic Usage

```html
<div id="tip-container"></div>

<script src="https://your-domain.com/embed.js"></script>
<script>
  AgentTipJar.createButton({
    agent: 'my-agent',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f...',
    text: '☕ Buy me a coffee',
    size: 'large',
    theme: 'dark',
    container: document.getElementById('tip-container')
  });
</script>
```

## API Reference

### POST `/api/create-wallet`

Generate a deterministic wallet for an agent.

**Request:**
```json
{
  "agentName": "my-agent",
  "secret": "optional-secret"
}
```

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f...",
  "agentName": "my-agent"
}
```

### GET `/api/check-balance?address=0x...`

Check USDC and ETH balance for an address.

**Response:**
```json
{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f...",
  "usdc": "125.50",
  "eth": "0.001",
  "network": "base"
}
```

## How It Works

### Deterministic Wallets

When you create a tip jar with an agent name, we generate a deterministic wallet:

```javascript
const seed = `agent-tipjar:${agentName}:${secret}`;
const privateKey = keccak256(seed);
const wallet = new Wallet(privateKey);
```

**Pros:**
- Same name always gives same address
- No database needed
- Easy to recover

**Cons:**
- If someone guesses your name + secret, they can derive your key
- Use a strong secret for production agents!

### Why Base?

- **Low gas fees**: ~$0.001 per transaction
- **Fast confirmations**: 2-second blocks
- **USDC native**: Circle-issued USDC with full liquidity
- **Ethereum security**: Settled on Ethereum L1

## Withdrawing Tips

1. **Import to MetaMask:**
   - Open MetaMask → Import Account
   - Paste your private key
   - Add Base network (Chain ID: 8453, RPC: https://mainnet.base.org)

2. **Alternative: Use CLI**
   ```javascript
   // Example withdrawal script
   const { ethers } = require('ethers');
   
   const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
   const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
   
   // Transfer USDC
   const usdc = new ethers.Contract(
     '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
     ['function transfer(address to, uint256 amount) returns (bool)'],
     wallet
   );
   
   await usdc.transfer('0xYourMainWallet...', ethers.parseUnits('100', 6));
   ```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/koriyoshi2041/agent-tipjar)

Or manually:

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BASE_RPC_URL` | Base RPC endpoint | `https://mainnet.base.org` |
| `NEXT_PUBLIC_BASE_URL` | Your domain | `http://localhost:3000` |

## Security Considerations

⚠️ **Important:**

1. **Private Keys**: Never expose private keys in client-side code or logs
2. **Deterministic Wallets**: Use strong secrets for production agents
3. **API Keys**: Consider rate limiting the wallet generation API
4. **HTTPS**: Always use HTTPS in production

For high-value agents, consider:
- Using a hardware wallet
- Multi-sig setup
- Professional key management (e.g., Fireblocks)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

```bash
# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

## Roadmap

- [ ] Multi-chain support (Ethereum, Polygon, Arbitrum)
- [ ] Payment notifications (webhooks)
- [ ] Tip analytics dashboard
- [ ] ENS/Basename support
- [ ] Fiat on-ramp integration
- [ ] Tip splits (multiple recipients)

## FAQ

**Q: Is this custodial?**  
A: No. You control the private keys. We never store them.

**Q: What if I lose my private key?**  
A: For deterministic wallets, regenerate using the same agent name + secret. For random wallets, funds are lost forever.

**Q: Can I use a different token?**  
A: Currently USDC only. Multi-token support is on the roadmap.

**Q: Are tips taxable?**  
A: Consult a tax professional in your jurisdiction. In most places, yes.

## License

MIT © 2024

---

Built with ❤️ for the AI agent economy.

**[⭐ Star on GitHub](https://github.com/koriyoshi2041/agent-tipjar)** if you find this useful!
