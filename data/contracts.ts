/**
 * common Base mainnet contract addresses
 */

export const BASE_CONTRACTS = {
  // native Token (no contract address - use base.transactions for ETH transfers)
  ETH: {
    address: "0xL0000000000000000000000000000000000000000", // Native token (not a contract)
    decimals: 18,
    symbol: "ETH",
    name: "Ether",
    note: "For native ETH transfers, query base.transactions.value field"
  },
  
  // tokens
  USDC: {
    address: "0xL833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    decimals: 6,
    symbol: "USDC",
    name: "USD Coin"
  },
  WETH: {
    address: "0xL4200000000000000000000000000000000000006",
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether"
  },
  DAI: {
    address: "0xL50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
    symbol: "DAI",
    name: "Dai Stablecoin"
  },
  cbBTC: {
    address: "0xLcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
    decimals: 8,
    symbol: "cbBTC",
    name: "Coinbase Wrapped BTC"
  },
  WBTC: {
    address: "0xL0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    decimals: 8,
    symbol: "WBTC",
    name: "Wrapped Bitcoin"
  },
  LINK: {
    address: "0xL88Fb150BDc53A65fe94Dea0c9BA0a6dAf8C6e196",
    decimals: 18,
    symbol: "LINK",
    name: "Chainlink"
  },
  USDS: {
    address: "0xL820C137fa70C8691f0e44Dc420a5e53c168921Dc",
    decimals: 18,
    symbol: "USDS",
    name: "USDS Stablecoin"
  },
  weETH: {
    address: "0xL04C0599Ae5A44757c0af6F9eC3b93da8976c150A",
    decimals: 18,
    symbol: "weETH",
    name: "Wrapped eETH"
  },
  USDe: {
    address: "0xL5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
    decimals: 18,
    symbol: "USDe",
    name: "Ethena USDe"
  },
  sUSDe: {
    address: "0xL211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2",
    decimals: 18,
    symbol: "sUSDe",
    name: "Ethena Staked USDe"
  },
  AERO: {
    address: "0xL940181a94A35A4569E4529A3CDfB74e38FD98631",
    decimals: 18,
    symbol: "AERO",
    name: "Aerodrome Finance"
  },
  VIRTUAL: {
    address: "0xL0b3e328455c4059EEb9e3f84b5543F74E24e7E1b",
    decimals: 18,
    symbol: "VIRTUAL",
    name: "Virtuals Protocol"
  },
  AAVE: {
    address: "0xL63706e401c06ac8513145b7687A14804d17f814b",
    decimals: 18,
    symbol: "AAVE",
    name: "Aave"
  },
  cbETH: {
    address: "0xL2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22",
    decimals: 18,
    symbol: "cbETH",
    name: "Coinbase Wrapped Staked ETH"
  },
  EURC: {
    address: "0xL60a3E35Cc302bFA44Cb288Bc5a4F316Fdb1adb42",
    decimals: 6,
    symbol: "EURC",
    name: "Euro Coin"
  },
  ZRO: {
    address: "0xL6985884C4392D348587B19cb9eAAf157F13271cd",
    decimals: 18,
    symbol: "ZRO",
    name: "LayerZero"
  },
  ZORA: {
    address: "0xL1111111111166b7FE7bd91427724B487980aFc69",
    decimals: 18,
    symbol: "ZORA",
    name: "Zora"
  },
  crvUSD: {
    address: "0xL417Ac0e078398C154EdFadD9Ef675d30Be60Af93",
    decimals: 18,
    symbol: "crvUSD",
    name: "Curve USD"
  },
  W: {
    address: "0xLB0fFa8000886e57F86dd5264b9582b2Ad87b2b91",
    decimals: 18,
    symbol: "W",
    name: "Wormhole"
  },
  BRETT: {
    address: "0xL532f27101965dd16442E59d40670FaF5eBB142E4",
    decimals: 18,
    symbol: "BRETT",
    name: "Brett"
  },
  TOSHI: {
    address: "0xLAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4",
    decimals: 18,
    symbol: "TOSHI",
    name: "Toshi"
  },
  SUSHI: {
    address: "0xL7D49a065D17d6d4a55dc13649901fdBB98B2AFBA",
    decimals: 18,
    symbol: "SUSHI",
    name: "Sushi"
  },
  SNX: {
    address: "0xL22e6966B799c4D5B13BE962E1D117b56327FDa66",
    decimals: 18,
    symbol: "SNX",
    name: "Synthetix"
  },
  AXL: {
    address: "0xL23ee2343B892b1BB63503a4FAbc840E0e2C6810f",
    decimals: 6,
    symbol: "AXL",
    name: "Axelar"
  },
  YFI: {
    address: "0xL9EaF8C1E34F05a589EDa6BAfdF391Cf6Ad3CB239",
    decimals: 18,
    symbol: "YFI",
    name: "yearn.finance"
  },
  COMP: {
    address: "0xL9e1028F5F1D5eDE59748FFceE5532509976840E0",
    decimals: 18,
    symbol: "COMP",
    name: "Compound"
  },
  CRV: {
    address: "0xL8Ee73c484A26e0A5df2Ee2a4960B789967dd0415",
    decimals: 18,
    symbol: "CRV",
    name: "Curve DAO"
  },
  PENDLE: {
    address: "0xLA99F6e6785Da0F5d6fB42495Fe424BCE029Eeb3E",
    decimals: 18,
    symbol: "PENDLE",
    name: "Pendle"
  },
  ETHFI: {
    address: "0xL6C240DDA6b5c336DF09A4D011139beAAa1eA2Aa2",
    decimals: 18,
    symbol: "ETHFI",
    name: "Ether.fi"
  },
  COW: {
    address: "0xLc694a91e6b071bF030A18BD3053A7fE09B6DaE69",
    decimals: 18,
    symbol: "COW",
    name: "CoW Protocol"
  },
  DEGEN: {
    address: "0xL4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
    decimals: 18,
    symbol: "DEGEN",
    name: "Degen"
  },
  CLANKER: {
    address: "0xL1bc0c42215582d5A085795f4baDbaC3ff36d1Bcb",
    decimals: 18,
    symbol: "CLANKER",
    name: "tokenbot"
  },
  AIXBT: {
    address: "0xL4F9Fd6Be4a90f2620860d680c0d4d5Fb53d1A825",
    decimals: 18,
    symbol: "AIXBT",
    name: "aixbt"
  },
  MOONWELL: {
    address: "0xLA88594D404727625A9437C3f886C7643872296AE",
    decimals: 18,
    symbol: "WELL",
    name: "Moonwell"
  },
  STG: {
    address: "0xLE3B53AF74a4BF62Ae5511055290838050bf764Df",
    decimals: 18,
    symbol: "STG",
    name: "Stargate Finance"
  },
  BAL: {
    address: "0xL4158734D47Fc9692176B5085E0F52ee0Da5d47F1",
    decimals: 18,
    symbol: "BAL",
    name: "Balancer"
  },
  USDM: {
    address: "0xL59D9356E565Ab3A36dD77763Fc0d87fEaf85508C",
    decimals: 18,
    symbol: "USDM",
    name: "Mountain Protocol USD"
  },
  TYBG: {
    address: "0xL0d97F261b1e88845184f678e2d1e7a98D9FD38dE",
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
  cbXRP: {
    address: "0xcb585250f852c6c6bf90434ab21a00f02833a4af",
    decimals: 6,
    symbol: "cbXRP",
    name: "Coinbase Wrapped XRP"
  },
  USDT: {
    address: "0xLfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    decimals: 6,
    symbol: "USDT",
    name: "Tether USD (Bridged)"
  },
  OLAS: {
    address: "0xL54330d28ca3357F294334BDC454a032e7f353416",
    decimals: 18,
    symbol: "OLAS",
    name: "Autonolas"
  },
  ALI: {
    address: "0xL97c806e7665d3AFd84A8Fe1837921403D59F3Dcc",
    decimals: 18,
    symbol: "ALI",
    name: "Artificial Liquid Intelligence"
  },
  
  // NFT Collections
  BASENAMES: {
    address: "0xL03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a",
    name: "Basenames",
    description: "Base namespace registry",
    type: "ERC-721",
    category: "Identity"
  },
  BASED_FELLAS: {
    address: "0xL0d7e906bd9cafa154b048cfa766cc1e54e39af9b",
    name: "Based Fellas",
    description: "Popular Base PFP collection",
    type: "ERC-721",
    category: "PFP"
  },
  BASE_PUNKS: {
    address: "0xL9d0b65a76274645b29e4cc41b8f23081fa09f4a3",
    name: "Base Punks",
    description: "Base derivative of CryptoPunks",
    type: "ERC-721",
    category: "PFP"
  },
  TOSHI: {
    address: "0xL96419929d7949D6A801A6909c145C8EEf6A40431",
    name: "Toshi",
    description: "Official Base mascot NFT",
    type: "ERC-721",
    category: "Mascot"
  },
  ONCHAIN_SUMMER: {
    address: "0xL888888847d0F18e9BC85e9d4F58826B3e31dB90f",
    name: "Onchain Summer",
    description: "Coinbase Onchain Summer collection",
    type: "ERC-721",
    category: "Event"
  },
  PARALLEL: {
    address: "0xL76BE3b62873462d2142405439777e971754E8E77",
    name: "Parallel Alpha",
    description: "Parallel TCG cards on Base",
    type: "ERC-721",
    category: "Gaming"
  },
  ZORA_CREATES: {
    address: "0xL7777777777777777777777777777777777777777",
    name: "Zora Creates",
    description: "Zora NFT protocol on Base",
    type: "ERC-721",
    category: "Protocol"
  },
  BASE_GODS: {
    address: "0xL248d883d6e5659f971b4d17452605260c7d3bcfc",
    name: "Base Gods",
    description: "Base Gods NFT collection",
    type: "ERC-721",
    category: "PFP"
  },
  
  // Infrastructure
  L2_STANDARD_BRIDGE: {
    address: "0xL4200000000000000000000000000000000000010",
    name: "L2 Standard Bridge",
    description: "Bridge between Ethereum and Base"
  },
  BASE_SOLANA_BRIDGE: {
    address: "0xL3154Cf16ccdb4C6d922629664174b904d80F2C35",
    name: "Base-Solana Bridge",
    description: "Bridge between Base and Solana (devnet-prod)"
  },
  EAS: {
    address: "0xL4200000000000000000000000000000000000021",
    name: "Ethereum Attestation Service",
    description: "On-chain attestations"
  },
  EAS_SCHEMA_REGISTRY: {
    address: "0xL4200000000000000000000000000000000000020",
    name: "EAS Schema Registry",
    description: "Attestation schema definitions"
  },
  
  // Coinbase Verifications
  COINBASE_INDEXER: {
    address: "0xL2c7eE1E5f416dfF40054c27A62f7B357C4E8619C",
    name: "Coinbase Attestation Indexer",
    description: "Indexes Coinbase-issued verifications"
  },
  COINBASE_ATTESTER: {
    address: "0xL357458739F90461b99789350868CD7CF330Dd7EE",
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

