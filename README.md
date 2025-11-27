# 🟦 BaseQL MCP Server 🟦

![BaseQL MCP](./baseql-mcp.png)

**all Base chain data at your agent's fingertips 🔥**

## about

the SQL API from Coinbase Developer Platform (CDP) indexes all Base chain data across blocks, events, tranfers, transactions, and encoded logs, and lets you (or your agent) submit SQL queries against that rich dataset

this is incredibly powerful because you don't need blockchain data infrastructure like indexers anymore; you simply call SQL API and get hyper-fresh data (<500ms to tip of chain) at blazing-fast latencies (<200ms)

**BUT** agents need some help to use this powerful tool

the **BaseQL MCP Server** gives an agent all the info and tools it needs to call SQL API independently, enabling the user to fetch relevant Base chain data using natural language 🎉

## what does BaseQL MCP Server include?

agents using BaseQL get:
- **common Base contract addresses** (USDC, WETH, AERO, other common ERC20s, popular NFTs, etc.)
- **accurate SQL API schema context** (correct column names, common mistakes)
- **pre-built query templates** (whale tracking, NFT analytics, gas analysis)
- **ENS/Basename resolution** (forward and reverse lookup)
- **direct SQL execution** via CDP SQL API
- **built-in best practices** (time filtering, performance optimization)

## how agents use this

here's an example of what this unlocks for agents:

```
user: "whow me USDC whale transfers in the last hour"
  ↓
agent set up with BaseQL MCP:
1. get_contract("USDC") → 0x833589fcd...
2. get_query_template("whale_transfers") → SQL template
3. fills in parameters
4. run_sql_query(sql) → calls CDP SQL API, which returns Base data to the agent
5. agent formats the data into natural language, and responds to the user
```

## quickstart

### installation

```bash
npm install -g baseql-mcp
```

### use with Claude Desktop

edit your Claude Desktop config:

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "baseql": {
      "command": "npx",
      "args": ["baseql-mcp"],
      "env": {
        "CDP_API_KEY_ID": "your-key-id",
        "CDP_API_KEY_SECRET": "your-secret",
        "CDP_WALLET_SECRET": "your-wallet-secret"
      }
    }
  }
}
```

**restart Claude Desktop** and ask: "what's the USDC contract address on Base?"

### use with ChatGPT

**note:** with ChatGPT you need to input your MCP Server's URL, so you'll need to deploy it first (e.g. to Vercel)

1. **enable developer mode in ChatGPT:**
   - open ChatGPT settings → **apps & connectors** → **advanced settings**
   - enable **developer mode** (you should also have this enabled in your soul)

2. **add MCP server:**
   - now go back to **apps & connectors**
   - click **create** top-right
   - fill in the MCP server details:
     - **name:** BaseQL
     - **URL:** your deployed URL e.g. `https://your-baseql-mcp.vercel.app`
     - **description:** Base data powerrrrr
   - click **save**

3. **test:**
   - start new chat in ChatGPT
   - ask something like: "how many USDC transfers happened on Base in the last hour?"
   - chatGPT uses your BaseQL MCP to fetch the data & respond

### local development

```bash
# clone this repo
git clone https://github.com/jnix2007/baseql-mcp
cd baseql-mcp

# install dependencies
npm install

# configure
cp .env.example .env
# edit .env with your CDP credentials you get from portal.cdp.coinbase.com

# run it
npm run dev
```

**test via HTTP:**
```bash
# list available tools
curl http://localhost:4000/tools

# query USDC transfers
curl -X POST http://localhost:4000/call \
  -H "Content-Type: application/json" \
  -d '{"tool":"run_sql_query","params":{"sql":"SELECT COUNT(*) as count FROM base.transfers WHERE token_address = '\''0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'\'' AND block_timestamp > NOW() - INTERVAL 1 HOUR"}}'
```

## tools included

### 1. `get_schema`
get complete Base SQL table schemas with correct column names and best practices

**example:**
```json
{
  "tool": "get_schema"
}
```

**returns:**
- all table schemas (base.transfers, base.transactions, base.events, base.blocks)
- critical rules (always filter by time!)
- common mistakes (column name corrections)

### 2. `get_contract`
get Base contract addresses by symbol

**example:**
```json
{
  "tool": "get_contract",
  "params": {
    "symbol": "USDC",
    "network": "mainnet"  // or "sepolia"
  }
}
```

**supports:**
- **46 tokens** (USDC, WETH, AERO, DEGEN, TYBG, JESSE, etc.)
- **8 NFT collections** (Basenames, Based Fellas, Base Punks, Base Gods, etc.)
- **Infrastructure** (Bridges, EAS, Coinbase Verifications)
- Base mainnet only

### 3. `get_query_template`
get pre-built SQL query templates

**example:**
```json
{
  "tool": "get_query_template",
  "params": {
    "templateKey": "whale_transfers"
  }
}
```

**available templates:**
- `whale_transfers` - large token movements
- `trending_tokens` - tokens with sudden activity
- `wallet_activity` - complete wallet history
- `gas_analysis` - gas spending patterns
- `nft_mints` - NFT minting activity
- `coinbase_verified_users` - addresses associated with Coinbase accounts (i.e. that have KYC'd at some point)
- `basename_registrations` - new .base.eth names
- and a bunch more

### 4. `run_sql_query`
execute actual SQL queries against Base blockchain

**example:**
```json
{
  "tool": "run_sql_query",
  "params": {
    "sql": "SELECT COUNT(*) FROM base.transfers WHERE token_address = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' AND block_timestamp > NOW() - INTERVAL 1 HOUR"
  }
}
```

**returns:** realtime Base data (<500ms from tip of chain)

### 5. `resolve_name`
convert ENS/Basename to address

**example:**
```json
{
  "tool": "resolve_name",
  "params": {
    "name": "jnix.base.eth"
  }
}
```

### 6. `get_name_for_address`
reverse ENS lookup (address → name)

### 7. `get_names_for_addresses`
batch reverse lookup for multiple addresses

## use cases for BaseQL MCP Server

### DeFi analytics
```
"show me top AERO holders"
"what's Uniswap V3 trading volume today?"
"find wallets bridging >$100k"
```

### NFT tracking
```
"recent Basename registrations"
"who owns the most Based Fellas?"
"find NFT whale collectors"
```

### market intel
```
"find tokens with sudden activity surge"
"track smart money moves"
"what are whales buying?"
```

## architecture

```
AI agent 🤖
    ↓
BaseQL MCP Server 💻
    ↓
CDP SQL API ⚡ → Base chain 🟦
```

**BaseQL provides:**
- context (contracts, schemas, templates)
- execution (runs queries via CDP)
- intelligence (best practices, optimization)

## configuration

### environment variables

```env
# required for SQL queries
CDP_API_KEY_ID=your-api-key-id
CDP_API_KEY_SECRET=your-api-key-secret

# optional for local dev
PORT=4000

# optional for monetization via x402
CDP_WALLET_SECRET=your-wallet-secret
ENABLE_PAYMENTS=false
QUERY_PRICE=0.001

```

get CDP API credentials from [CDP Portal](https://portal.cdp.coinbase.com/)

### modes

**stdio mode** (for Claude Desktop):
- uncomment stdio transport in server.ts
- uses stdin/stdout

**HTTP mode** (for testing/custom agents):
- comment out stdio transport
- runs on PORT (default 4000)

## why BaseQL MCP Server is dope

### accurate schema
learned the hard way that Base SQL tables have inconsistent column names:
- `base.transfers` → `token_address`, `block_timestamp`
- `base.events` → `address`, `block_timestamp`
- `base.transactions` → `from_address`, `timestamp` (NOT block_timestamp)

BaseQL documents all these gotchas

### guardrails
queries without time filters can scan 100GB+ and fail; BaseQL teaches agents to **always** filter by time first

### curated context
repo of common contract addresses

### realtime data
CDP SQL API is < 500ms from tip of chain, so BaseQL queries get near-instant Base data

## examples

### find USDC whales

```bash
# 1. get USDC address
get_contract({ symbol: "USDC" })

# 2. get template
get_query_template({ templateKey: "whale_transfers" })

# 3. run query
run_sql_query({
  sql: "SELECT from_address, value FROM base.transfers 
        WHERE token_address = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' 
        AND value > 1000000000000 
        AND block_timestamp > NOW() - INTERVAL 24 HOUR 
        LIMIT 20"
})
```

### track Basename registrations

```bash
run_sql_query({
  sql: "SELECT to_address, block_timestamp FROM base.transfers 
        WHERE token_address = '0x03c4738ee98ae44591e1a4a4f3cab6641d95dd9a' 
        AND from_address = '0x0000000000000000000000000000000000000000' 
        AND block_timestamp > NOW() - INTERVAL 7 DAY 
        LIMIT 50"
})
```

## license

MIT

## links

- [CDP SQL API Docs](https://docs.cdp.coinbase.com/data/sql-api)
- [MCP Protocol](https://modelcontextprotocol.io/)