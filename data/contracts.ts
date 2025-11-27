/**
 * common Base mainnet contract addresses
 */

export const BASE_CONTRACTS = {
  // native Token (no contract address - use base.transactions for ETH transfers)
  ETH: {
    address: "0x0000000000000000000000000000000000000000", // Native token (not a contract)
    decimals: 18,
    symbol: "ETH",
    name: "Ether",
    note: "For native ETH transfers, query base.transactions.value field"
  },
  
  // tokens
  USDC: {
    address: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    decimals: 6,
    symbol: "USDC",
    name: "USD Coin"
  },
  WETH: {
    address: "0x4200000000000000000000000000000000000006",
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether"
  },
  DAI: {
    address: "0x50c5725949a6f0c72e6c4a641f24049a917db0cb",
    decimals: 18,
    symbol: "DAI",
    name: "Dai Stablecoin"
  },
  CBBTC: {
    address: "0xcbb7c0000ab88b473b1f5afd9ef808440eed33bf",
    decimals: 8,
    symbol: "cbBTC",
    name: "Coinbase Wrapped BTC"
  },
  WBTC: {
    address: "0x0555e30da8f98308edb960aa94c0db47230d2b9c",
    decimals: 8,
    symbol: "WBTC",
    name: "Wrapped Bitcoin"
  },
  LINK: {
    address: "0x88fb150bdc53a65fe94dea0c9ba0a6daf8c6e196",
    decimals: 18,
    symbol: "LINK",
    name: "Chainlink"
  },
  USDS: {
    address: "0x820c137fa70c8691f0e44dc420a5e53c168921dc",
    decimals: 18,
    symbol: "USDS",
    name: "USDS Stablecoin"
  },
  weETH: {
    address: "0x04c0599ae5a44757c0af6f9ec3b93da8976c150a",
    decimals: 18,
    symbol: "weETH",
    name: "Wrapped eETH"
  },
  USDe: {
    address: "0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34",
    decimals: 18,
    symbol: "USDe",
    name: "Ethena USDe"
  },
  sUSDe: {
    address: "0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2",
    decimals: 18,
    symbol: "sUSDe",
    name: "Ethena Staked USDe"
  },
  AERO: {
    address: "0x940181a94a35a4569e4529a3cdfb74e38fd98631",
    decimals: 18,
    symbol: "AERO",
    name: "Aerodrome Finance"
  },
  VIRTUAL: {
    address: "0x0b3e328455c4059eeb9e3f84b5543f74e24e7e1b",
    decimals: 18,
    symbol: "VIRTUAL",
    name: "Virtuals Protocol"
  },
  AAVE: {
    address: "0x63706e401c06ac8513145b7687a14804d17f814b",
    decimals: 18,
    symbol: "AAVE",
    name: "Aave"
  },
  CBETH: {
    address: "0x2ae3f1ec7f1f5012cfeab0185bfc7aa3cf0dec22",
    decimals: 18,
    symbol: "cbETH",
    name: "Coinbase Wrapped Staked ETH"
  },
  EURC: {
    address: "0x60a3e35cc302bfa44cb288bc5a4f316fdb1adb42",
    decimals: 6,
    symbol: "EURC",
    name: "Euro Coin"
  },
  ZRO: {
    address: "0x6985884c4392d348587b19cb9eaaf157f13271cd",
    decimals: 18,
    symbol: "ZRO",
    name: "LayerZero"
  },
  ZORA: {
    address: "0x1111111111166b7fe7bd91427724b487980afc69",
    decimals: 18,
    symbol: "ZORA",
    name: "Zora"
  },
  crvUSD: {
    address: "0x417ac0e078398c154edfadd9ef675d30be60af93",
    decimals: 18,
    symbol: "crvUSD",
    name: "Curve USD"
  },
  W: {
    address: "0xb0ffa8000886e57f86dd5264b9582b2ad87b2b91",
    decimals: 18,
    symbol: "W",
    name: "Wormhole"
  },
  BRETT: {
    address: "0x532f27101965dd16442e59d40670faf5ebb142e4",
    decimals: 18,
    symbol: "BRETT",
    name: "Brett"
  },
  TOSHI: {
    address: "0xac1bd2486aaf3b5c0fc3fd868558b082a531b2b4",
    decimals: 18,
    symbol: "TOSHI",
    name: "Toshi"
  },
  SUSHI: {
    address: "0x7d49a065d17d6d4a55dc13649901fdbb98b2afba",
    decimals: 18,
    symbol: "SUSHI",
    name: "Sushi"
  },
  SNX: {
    address: "0x22e6966b799c4d5b13be962e1d117b56327fda66",
    decimals: 18,
    symbol: "SNX",
    name: "Synthetix"
  },
  AXL: {
    address: "0x23ee2343b892b1bb63503a4fabc840e0e2c6810f",
    decimals: 6,
    symbol: "AXL",
    name: "Axelar"
  },
  YFI: {
    address: "0x9eaf8c1e34f05a589eda6bafdf391cf6ad3cb239",
    decimals: 18,
    symbol: "YFI",
    name: "yearn.finance"
  },
  COMP: {
    address: "0x9e1028f5f1d5ede59748ffcee5532509976840e0",
    decimals: 18,
    symbol: "COMP",
    name: "Compound"
  },
  CRV: {
    address: "0x8ee73c484a26e0a5df2ee2a4960b789967dd0415",
    decimals: 18,
    symbol: "CRV",
    name: "Curve DAO"
  },
  PENDLE: {
    address: "0xa99f6e6785da0f5d6fb42495fe424bce029eeb3e",
    decimals: 18,
    symbol: "PENDLE",
    name: "Pendle"
  },
  ETHFI: {
    address: "0x6c240dda6b5c336df09a4d011139beaaa1ea2aa2",
    decimals: 18,
    symbol: "ETHFI",
    name: "Ether.fi"
  },
  COW: {
    address: "0xc694a91e6b071bf030a18bd3053a7fe09b6dae69",
    decimals: 18,
    symbol: "COW",
    name: "CoW Protocol"
  },
  DEGEN: {
    address: "0x4ed4e862860bed51a9570b96d89af5e1b0efefed",
    decimals: 18,
    symbol: "DEGEN",
    name: "Degen"
  },
  CLANKER: {
    address: "0x1bc0c42215582d5a085795f4badbac3ff36d1bcb",
    decimals: 18,
    symbol: "CLANKER",
    name: "tokenbot"
  },
  AIXBT: {
    address: "0x4f9fd6be4a90f2620860d680c0d4d5fb53d1a825",
    decimals: 18,
    symbol: "AIXBT",
    name: "aixbt"
  },
  MOONWELL: {
    address: "0xa88594d404727625a9437c3f886c7643872296ae",
    decimals: 18,
    symbol: "WELL",
    name: "Moonwell"
  },
  STG: {
    address: "0xe3b53af74a4bf62ae5511055290838050bf764df",
    decimals: 18,
    symbol: "STG",
    name: "Stargate Finance"
  },
  BAL: {
    address: "0x4158734d47fc9692176b5085e0f52ee0da5d47f1",
    decimals: 18,
    symbol: "BAL",
    name: "Balancer"
  },
  USDM: {
    address: "0x59d9356e565ab3a36dd77763fc0d87feaf85508c",
    decimals: 18,
    symbol: "USDM",
    name: "Mountain Protocol USD"
  },
  TYBG: {
    address: "0x0d97f261b1e88845184f678e2d1e7a98d9fd38de",
    decimals: 18,
    symbol: "TYBG",
    name: "TYBG"
  },
  JESSE: {
    address: "0x50f88fe97f72cd3e75b9eb4f747f59bceba80d59",
    decimals: 18,
    symbol: "JESSE",
    name: "Jesse Pollak Creator Coin"
  },
  AYB: {
    address: "0xb96cfc6f81f85c58a1eccdd9ec2ad940e2cb8453",
    decimals: 18,
    symbol: "AYB",
    name: "All Your Base"
  },
  MCADE: {
    address: "0xc48823ec67720a04a9dfd8c7d109b2c3d6622094",
    decimals: 18,
    symbol: "MCADE",
    name: "Metacade"
  },
  CBXEN: {
    address: "0xffcbf84650ce02dafe96926b37a0ac5e34932fa5",
    decimals: 18,
    symbol: "cbXEN",
    name: "cbXEN"
  },
  CBXRP: {
    address: "0xcb585250f852c6c6bf90434ab21a00f02833a4af",
    decimals: 6,
    symbol: "cbXRP",
    name: "Coinbase Wrapped XRP"
  },
  USDT: {
    address: "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2",
    decimals: 6,
    symbol: "USDT",
    name: "Tether USD (Bridged)"
  },
  OLAS: {
    address: "0x54330d28ca3357f294334bdc454a032e7f353416",
    decimals: 18,
    symbol: "OLAS",
    name: "Autonolas"
  },
  ALI: {
    address: "0x97c806e7665d3afd84a8fe1837921403d59f3dcc",
    decimals: 18,
    symbol: "ALI",
    name: "Artificial Liquid Intelligence"
  },
  
  // NFT Collections
  BASENAMES: {
    address: "0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a",
    name: "Basenames",
    description: "Base namespace registry",
    type: "ERC-721",
    category: "Identity"
  },
  BASED_FELLAS: {
    address: "0x0d7e906bd9cafa154b048cfa766cc1e54e39af9b",
    name: "Based Fellas",
    description: "Popular Base PFP collection",
    type: "ERC-721",
    category: "PFP"
  },
  BASE_PUNKS: {
    address: "0x9d0b65a76274645b29e4cc41b8f23081fa09f4a3",
    name: "Base Punks",
    description: "Base derivative of CryptoPunks",
    type: "ERC-721",
    category: "PFP"
  },
  ONCHAIN_SUMMER: {
    address: "0x888888847d0f18e9bc85e9d4f58826b3e31db90f",
    name: "Onchain Summer",
    description: "Coinbase Onchain Summer collection",
    type: "ERC-721",
    category: "Event"
  },
  PARALLEL: {
    address: "0x76be3b62873462d2142405439777e971754e8e77",
    name: "Parallel Alpha",
    description: "Parallel TCG cards on Base",
    type: "ERC-721",
    category: "Gaming"
  },
  ZORA_CREATES: {
    address: "0x7777777777777777777777777777777777777777",
    name: "Zora Creates",
    description: "Zora NFT protocol on Base",
    type: "ERC-721",
    category: "Protocol"
  },
  BASE_GODS: {
    address: "0x248d883d6e5659f971b4d17452605260c7d3bcfc",
    name: "Base Gods",
    description: "Base Gods NFT collection",
    type: "ERC-721",
    category: "PFP"
  },
  
  // Infrastructure
  L2_STANDARD_BRIDGE: {
    address: "0x4200000000000000000000000000000000000010",
    name: "L2 Standard Bridge",
    description: "Bridge between Ethereum and Base"
  },
  BASE_SOLANA_BRIDGE: {
    address: "0x3154cf16ccdb4c6d922629664174b904d80f2c35",
    name: "Base-Solana Bridge",
    description: "Bridge between Base and Solana (devnet-prod)"
  },
  EAS: {
    address: "0x4200000000000000000000000000000000000021",
    name: "Ethereum Attestation Service",
    description: "On-chain attestations"
  },
  EAS_SCHEMA_REGISTRY: {
    address: "0x4200000000000000000000000000000000000020",
    name: "EAS Schema Registry",
    description: "Attestation schema definitions"
  },
  
  // Coinbase Verifications
  COINBASE_INDEXER: {
    address: "0x2c7ee1e5f416dff40054c27a62f7b357c4e8619c",
    name: "Coinbase Attestation Indexer",
    description: "Indexes Coinbase-issued verifications"
  },
  COINBASE_ATTESTER: {
    address: "0x357458739f90461b99789350868cd7cf330dd7ee",
    name: "Coinbase Attester",
    description: "Issues Coinbase verifications"
  }
} as const;

/**
 * Coinbase Verification Schema IDs (Base Mainnet)
 */
export const COINBASE_VERIFICATION_SCHEMAS = {
  VERIFIED_ACCOUNT: {
    id: "0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9",
    description: "User has a verified Coinbase trading account",
    field: "verifiedAccount (boolean)"
  },
  VERIFIED_COUNTRY: {
    id: "0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065",
    description: "User's verified country of residence",
    field: "verifiedCountry (string, ISO 3166-1 alpha-2)"
  },
  COINBASE_ONE: {
    id: "0x254bd1b63e0591fefa66818ca054c78627306f253f86be6023725a67ee6bf9f4",
    description: "User has active Coinbase One membership",
    field: "isCoinbaseOne (boolean)"
  }
} as const;

export type ContractSymbol = keyof typeof BASE_CONTRACTS;
// mainnet only - no sepolia support
export function getContract(symbol: string) {
  const upperSymbol = symbol.toUpperCase();
  return BASE_CONTRACTS[upperSymbol as ContractSymbol];
}

