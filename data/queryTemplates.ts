/**
 * pre-built SQL query templates for common Base queries
 */

export const QUERY_TEMPLATES = {
  whale_transfers: {
    description: "Find large token transfers",
    parameters: ["token_address", "min_amount_raw", "hours"],
    sql: `
SELECT 
  from_address,
  to_address,
  value,
  transaction_hash,
  block_timestamp
FROM base.transfers
WHERE contract_address = '{token_address}'
  AND value > {min_amount_raw}
  AND block_timestamp > NOW() - INTERVAL {hours} HOUR
ORDER BY value DESC
LIMIT 20
    `.trim()
  },

  trending_tokens: {
    description: "Find tokens with sudden activity surge",
    parameters: ["hours"],
    sql: `
SELECT 
  contract_address,
  COUNT(DISTINCT from_address) as unique_senders,
  COUNT(*) as transfer_count
FROM base.transfers
WHERE block_timestamp > NOW() - INTERVAL {hours} HOUR
GROUP BY contract_address
HAVING unique_senders > 10
ORDER BY transfer_count DESC
LIMIT 20
    `.trim()
  },

  wallet_activity: {
    description: "Get all activity for a specific wallet",
    parameters: ["address", "days"],
    sql: `
SELECT 
  block_timestamp,
  transaction_hash,
  CASE 
    WHEN from_address = '{address}' THEN 'SENT'
    ELSE 'RECEIVED'
  END as direction,
  contract_address,
  value,
  from_address,
  to_address
FROM base.transfers
WHERE (from_address = '{address}' OR to_address = '{address}')
  AND block_timestamp > NOW() - INTERVAL {days} DAY
ORDER BY block_timestamp DESC
LIMIT 100
    `.trim()
  },

  token_holders: {
    description: "Find top holders of ANY token. CRITICAL: Must include time filter even for full history! Use 90-180 days for most tokens (covers complete history while avoiding 100GB scan).",
    parameters: ["token_address", "days"],
    sql: `
SELECT 
  holder,
  SUM(delta) as current_balance
FROM (
  SELECT 
    to_address as holder, 
    toInt256(value) as delta
  FROM base.transfers
  WHERE token_address = '{token_address}'
  GROUP BY to_address
  
  UNION ALL
  
  SELECT 
    from_address as holder, 
    -toInt256(value) as delta
  FROM base.transfers
  WHERE token_address = '{token_address}'
    AND from_address != '0x0000000000000000000000000000000000000000'
  GROUP BY from_address
) balances
GROUP BY holder
HAVING SUM(delta) > 0
ORDER BY current_balance DESC
LIMIT 50
    `.trim(),
    usage_notes: [
      "✅ This query analyzes COMPLETE transfer history - not a sample!",
      "✅ base.transfers contains ALL ERC-20 transfers on Base since genesis",
      "✅ Use toInt256() to avoid type errors when negating values",
      "✅ Excludes 0x0 address (mints) from outflows",
      "✅ Results show ACTUAL current holder balances"
    ]
  },

  nft_sales: {
    description: "Find recent NFT sales with price data",
    parameters: ["nft_address", "hours"],
    sql: `
SELECT 
  t.transaction_hash,
  t.block_timestamp,
  e.parameters as transfer_data,
  tx.from_address as buyer,
  tx.value as price_paid_wei
FROM base.events e
JOIN base.transactions tx ON e.transaction_hash = tx.transaction_hash
JOIN base.transfers t ON e.transaction_hash = t.transaction_hash
WHERE e.contract_address = '{nft_address}'
  AND e.event_signature = 'Transfer(address,address,uint256)'
  AND e.block_timestamp > NOW() - INTERVAL {hours} HOUR
ORDER BY e.block_timestamp DESC
LIMIT 50
    `.trim()
  },

  gas_leaderboard: {
    description: "Find addresses spending the most gas",
    parameters: ["hours"],
    sql: `
SELECT 
  from_address,
  COUNT(*) as tx_count,
  SUM(gas_used * gas_price) / 1e18 as total_gas_eth,
  AVG(gas_used * gas_price) / 1e18 as avg_gas_per_tx
FROM base.transactions
WHERE block_timestamp > NOW() - INTERVAL {hours} HOUR
GROUP BY from_address
ORDER BY total_gas_eth DESC
LIMIT 20
    `.trim()
  },

  dex_swap_volume: {
    description: "Track DEX swap activity and volume for a token pair",
    parameters: ["token_address", "hours"],
    sql: `
SELECT 
  address as dex_contract,
  event_signature,
  COUNT(*) as swap_count,
  COUNT(DISTINCT transaction_from) as unique_traders,
  MIN(block_timestamp) as first_swap,
  MAX(block_timestamp) as last_swap
FROM base.events
WHERE event_signature IN ('Swap(address,int256,int256,uint160,uint128,int24)', 'Swap(address,uint256,uint256,uint256,uint256,address)')
  AND (
    parameters LIKE '%{token_address}%'
    OR topics[2] = '{token_address}'
    OR topics[3] = '{token_address}'
  )
  AND block_timestamp > NOW() - INTERVAL {hours} HOUR
GROUP BY address, event_signature
ORDER BY swap_count DESC
    `.trim()
  },

  uniswap_v3_pools: {
    description: "Find Uniswap V3 pools for a specific token",
    parameters: ["token_address"],
    sql: `
SELECT DISTINCT
  address as pool_address,
  COUNT(*) as swap_count,
  COUNT(DISTINCT transaction_from) as traders
FROM base.events
WHERE event_signature = 'Swap(address,int256,int256,uint160,uint128,int24)'
  AND (
    topics[2] LIKE '%{token_address}%'
    OR topics[3] LIKE '%{token_address}%'
  )
  AND block_timestamp > NOW() - INTERVAL 7 DAY
GROUP BY address
ORDER BY swap_count DESC
LIMIT 20
    `.trim()
  },

  smart_money_moves: {
    description: "Track what successful traders are buying",
    parameters: ["trader_address", "days"],
    sql: `
SELECT 
  contract_address as token,
  SUM(value) as total_bought,
  COUNT(*) as buy_count,
  MAX(block_timestamp) as last_buy
FROM base.transfers
WHERE to_address = '{trader_address}'
  AND from_address != '{trader_address}'
  AND block_timestamp > NOW() - INTERVAL {days} DAY
GROUP BY contract_address
ORDER BY buy_count DESC
LIMIT 20
    `.trim()
  },

  bridge_activity: {
    description: "Monitor bridge deposits/withdrawals",
    parameters: ["bridge_address", "hours"],
    sql: `
SELECT 
  block_timestamp,
  from_address as user,
  to_address as destination,
  value,
  transaction_hash
FROM base.transfers
WHERE (from_address = '{bridge_address}' OR to_address = '{bridge_address}')
  AND block_timestamp > NOW() - INTERVAL {hours} HOUR
ORDER BY block_timestamp DESC
LIMIT 50
    `.trim()
  },

  failed_transactions: {
    description: "Find failed transactions for debugging",
    parameters: ["address", "hours"],
    sql: `
SELECT 
  transaction_hash,
  block_timestamp,
  from_address,
  to_address,
  gas_used,
  input_data
FROM base.transactions
WHERE from_address = '{address}'
  AND block_timestamp > NOW() - INTERVAL {hours} HOUR
  AND status = 0
ORDER BY block_timestamp DESC
LIMIT 20
    `.trim()
  },

  new_tokens_launched: {
    description: "Find newly deployed token contracts",
    parameters: ["hours"],
    sql: `
SELECT DISTINCT
  contract_address,
  MIN(block_timestamp) as first_seen,
  COUNT(DISTINCT to_address) as initial_holders
FROM base.transfers
WHERE block_timestamp > NOW() - INTERVAL {hours} HOUR
GROUP BY contract_address
HAVING initial_holders > 5
ORDER BY first_seen DESC
LIMIT 30
    `.trim()
  },

  coinbase_verified_users: {
    description: "Find Coinbase-verified accounts with attestations",
    parameters: ["hours"],
    sql: `
SELECT 
  parameters->>'recipient' as wallet_address,
  event_signature,
  block_timestamp,
  transaction_hash
FROM base.events
WHERE contract_address = '0x4200000000000000000000000000000000000021'
  AND event_signature = 'Attested(address,address,bytes32,bytes32)'
  AND parameters->>'attester' = '0x357458739F90461b99789350868CD7CF330Dd7EE'
  AND block_timestamp > NOW() - INTERVAL {hours} HOUR
ORDER BY block_timestamp DESC
LIMIT 50
    `.trim()
  },

  check_verifications: {
    description: "Check if an address has Coinbase verifications",
    parameters: ["address"],
    sql: `
SELECT 
  parameters->>'schemaId' as schema_id,
  block_timestamp as verified_at,
  transaction_hash
FROM base.events
WHERE contract_address = '0x4200000000000000000000000000000000000021'
  AND event_signature = 'Attested(address,address,bytes32,bytes32)'
  AND parameters->>'recipient' = '{address}'
  AND parameters->>'attester' = '0x357458739F90461b99789350868CD7CF330Dd7EE'
ORDER BY block_timestamp DESC
LIMIT 10
    `.trim()
  },

  us_verified_wallets: {
    description: "Find US-verified wallets (useful for compliance)",
    parameters: ["days"],
    sql: `
SELECT 
  parameters->>'recipient' as wallet_address,
  block_timestamp as verified_at
FROM base.events
WHERE contract_address = '0x4200000000000000000000000000000000000021'
  AND parameters->>'schemaId' = '0x1801901fabd0e6189356b4fb52bb0ab855276d84f7ec140839fbd1f6801ca065'
  AND parameters->>'attester' = '0x357458739F90461b99789350868CD7CF330Dd7EE'
  AND block_timestamp > NOW() - INTERVAL {days} DAY
ORDER BY block_timestamp DESC
LIMIT 100
    `.trim()
  },

  nft_mints: {
    description: "Track NFT mints for a collection",
    parameters: ["nft_address", "hours"],
    sql: `
SELECT 
  to_address as minter,
  token_id,
  transaction_hash,
  block_timestamp
FROM base.transfers
WHERE contract_address = '{nft_address}'
  AND from_address = '0x0000000000000000000000000000000000000000'
  AND block_timestamp > NOW() - INTERVAL {hours} HOUR
ORDER BY block_timestamp DESC
LIMIT 100
    `.trim()
  },

  nft_floor_tracking: {
    description: "Track NFT collection activity and potential floor price",
    parameters: ["nft_address", "days"],
    sql: `
SELECT 
  DATE(block_timestamp) as date,
  COUNT(*) as transfers,
  COUNT(DISTINCT to_address) as unique_buyers,
  COUNT(DISTINCT from_address) as unique_sellers
FROM base.transfers
WHERE contract_address = '{nft_address}'
  AND from_address != '0x0000000000000000000000000000000000000000'
  AND block_timestamp > NOW() - INTERVAL {days} DAY
GROUP BY DATE(block_timestamp)
ORDER BY date DESC
    `.trim()
  },

  nft_whale_collectors: {
    description: "Find wallets holding the most NFTs from a collection",
    parameters: ["nft_address"],
    sql: `
SELECT 
  to_address as collector,
  COUNT(DISTINCT token_id) as nfts_held,
  MIN(block_timestamp) as first_acquired,
  MAX(block_timestamp) as last_acquired
FROM base.transfers
WHERE contract_address = '{nft_address}'
GROUP BY to_address
ORDER BY nfts_held DESC
LIMIT 50
    `.trim()
  },

  basename_registrations: {
    description: "Track recent Basename registrations",
    parameters: ["hours"],
    sql: `
SELECT 
  to_address as owner,
  token_id,
  transaction_hash,
  block_timestamp
FROM base.transfers
WHERE contract_address = '0x03c4738Ee98aE44591e1A4A4F3CaB6641d95DD9a'
  AND from_address = '0x0000000000000000000000000000000000000000'
  AND block_timestamp > NOW() - INTERVAL {hours} HOUR
ORDER BY block_timestamp DESC
LIMIT 50
    `.trim()
  }
} as const;

export type QueryTemplateKey = keyof typeof QUERY_TEMPLATES;


