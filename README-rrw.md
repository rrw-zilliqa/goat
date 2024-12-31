# Secrets

Secrets come from either the character file or from environment variables of the same name.

# Build

  1. Check out `eliza` and `goat` into a directory - put it in `BASE`
  2. Now you need to `cd eliza/packages/plugin-goat` and `pnpm link` the relevant bits of goat:
  
```
pnpm link $BASE/typescript/packages/core
pnpm link $BASE/typescript/packages/plugin-coingecko
pnpm link $BASE/typescript/packages/plugin-erc20
pnpm link $BASE/typescript/packages/plugin-zilliqa
pnpm link $BASE/typescript/packages/wallet-evm
pnpm link $BASE/typescript/packages/wallet-viem
```

You can then `pnpm i` and `pnpm build` goat and eliza. You'll need to rebuild the plugins whenever you change them.

# Run

```
export EVM_PROVIDER_URL="https://api.zq2-protomainnet.zilliqa.com"
export EVM_PRIVATE_KEY=[privkey]
export COINGECKO_API_KEY=[coingecko-key]
pnpm start --characters="characters/george.character.json"
```

And for the UI:

```
cd eliza/client
pnpm run dev
```
