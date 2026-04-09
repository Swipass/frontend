# Swipass Frontend — v0.1

Next.js 15 + React 19 frontend for the Swipass bridge.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/bridge` | Bridge widget — connect wallet, quote, sign, track |
| `/bridge/status/:id` | Live transfer status tracker |
| `/admin` | Admin overview stats |
| `/admin/transactions` | All bridge executions |
| `/admin/fees` | Fee percentage configuration |
| `/admin/bridges` | Enable/disable bridges |

## Quick start

```bash
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
npm run dev                   # starts on :3000
```

## Wallet support

Mobile wallets supported via WalletConnect v2 + RainbowKit:
- MetaMask (browser + mobile)
- Coinbase Wallet
- Rainbow
- Trust Wallet
- Any WalletConnect-compatible wallet

Get a free WalletConnect Project ID at https://cloud.walletconnect.com

## Environment variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id_here
```

## Admin access

Navigate to `/admin`. Sign in with the credentials set in the backend's
`ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars (auto-created on first startup).
Admin session is stored in `sessionStorage` — cleared on tab close.
