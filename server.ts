import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CdpClient } from "@coinbase/cdp-sdk";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { generateJwt } from "@coinbase/cdp-sdk/auth";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { BASE_CONTRACTS, getContract, type ContractSymbol } from "./data/contracts.js";
import { QUERY_TEMPLATES, type QueryTemplateKey } from "./data/queryTemplates.js";

dotenv.config();

const PORT = parseInt(process.env.PORT || "4000");

// Initialize CDP wallet
// Initialize CDP wallet (optional - only needed for x402 payments)
let wallet: any = null;

try {
  if (process.env.CDP_WALLET_SECRET) {
    const cdp = new CdpClient();
    wallet = await cdp.evm.getOrCreateAccount({
      name: "baseql-mcp-wallet"
    });
    console.log(`💰 BaseQL MCP wallet: ${wallet.address}`);
  } else {
    console.log(`⚠️  No CDP_WALLET_SECRET - running without payment support`);
  }
} catch (error) {
  console.log(`⚠️  Wallet creation failed:`, error instanceof Error ? error.message : error);
}

// Create MCP server
const mcpServer = new McpServer({
  name: "baseql-mcp",
  version: "1.0.0",
});

// Get Schema
mcpServer.tool(
  "get_schema",
  "Get Base SQL tables, columns, and best practices",
  {},
  async () => {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          tables: {
            "base.transfers": {
              description: "Token transfer events (ERC-20, ERC-721, ERC-1155)",
              key_columns: [
                "block_number",
                "block_timestamp (YES, this table has it!)",
                "transaction_to (recipient - NOT transaction_hash!)",
                "transaction_from (sender)",
                "log_index",
                "token_address (token contract - NOT contract_address!)",
                "from_address (address tokens transferred from)",
                "to_address (address tokens transferred to)",
                "value (amount in smallest unit - uint256)",
                "action (Enum8: 1=added, -1=reorg removed)"
              ],
              notes: [
                "token_address = the ERC-20/721/1155 contract address",
                "from_address/to_address = who sent/received the tokens",
                "transaction_from/transaction_to = who initiated/received the tx",
                "For ERC-20: value = amount * 10^decimals",
                "For NFTs: value = token_id",
                "Filter mints: from_address = '0x0000000000000000000000000000000000000000'"
              ]
            },
            "base.transactions": {
              description: "Transaction data including hash, block number, gas usage",
              key_columns: [
                "block_number",
                "block_hash",
                "timestamp (NOT block_timestamp!)",
                "transaction_hash",
                "transaction_index",
                "from_address (EOA that sent tx)",
                "to_address (recipient - EOA or contract)",
                "value (amount in wei)",
                "gas (gas limit)",
                "gas_price",
                "max_fee_per_gas",
                "max_priority_fee_per_gas",
                "input (calldata)",
                "nonce",
                "type (tx type)",
                "chain_id"
              ],
              notes: [
                "Use 'timestamp' not 'block_timestamp'",
                "value is in wei (String type for big numbers)",
                "from_address is always EOA, to_address can be contract",
                "action: 1 = added, -1 = removed (reorg)"
              ]
            },
            "base.events": {
              description: "Decoded event logs with contract interactions",
              key_columns: [
                "block_number",
                "block_timestamp",
                "transaction_hash",
                "transaction_to",
                "transaction_from",
                "log_index",
                "address (contract address - NOT contract_address!)",
                "event_name",
                "event_signature",
                "parameters (Map of param name to value)",
                "parameter_types (Map of param name to ABI type)",
                "topics (Array of indexed params)"
              ],
              notes: [
                "address = contract that emitted the event",
                "parameters is a Map, access with: parameters->>'key'",
                "Use event_signature for filtering specific events"
              ]
            },
            "base.blocks": {
              description: "Block metadata including timestamps and difficulty",
              key_columns: [
                "block_number",
                "timestamp (NOT block_timestamp!)",
                "block_hash",
                "parent_hash",
                "miner",
                "gas_used",
                "gas_limit",
                "base_fee_per_gas",
                "transaction_count",
                "size"
              ],
              notes: [
                "Use 'timestamp' not 'block_timestamp' for blocks table",
                "miner = validator address",
                "action: 1 = added, -1 = removed (reorg)"
              ]
            },
            "base.encoded_logs": {
              description: "Encoded/undecoded event logs (e.g., log0 opcode)",
              key_columns: [
                "block_number",
                "block_timestamp (YES, this one has block_timestamp!)",
                "block_hash",
                "transaction_hash",
                "transaction_to",
                "transaction_from",
                "log_index",
                "address (contract that emitted log)",
                "topics (Array of indexed params)",
                "action (Enum8: -1=removed, 1=added)"
              ],
              notes: [
                "Use when events aren't in base.events (couldn't be decoded)",
                "Topics are raw hashes, not decoded parameters",
                "Useful for debugging or non-standard events"
              ]
            }
          },
          critical_rules: [
            "⚠️ ALWAYS filter by block_timestamp first to avoid scanning 100GB+ data",
            "✅ Use: WHERE block_timestamp > NOW() - INTERVAL X HOUR/DAY",
            "❌ Don't: ORDER BY timestamp without time filter (will fail)",
            "✅ ClickHouse SQL dialect (not standard SQL)",
            "✅ Read-only (SELECT only)",
            "✅ Max 100,000 rows per query",
            "✅ 30 second timeout"
          ],
          common_mistakes: {
            "base.transfers columns": {
              wrong: "transaction_hash, contract_address",
              correct: "transaction_to, token_address"
            },
            "missing time filter": {
              wrong: "SELECT * FROM base.transfers ORDER BY block_timestamp DESC",
              correct: "SELECT * FROM base.transfers WHERE block_timestamp > NOW() - INTERVAL 1 DAY ORDER BY block_timestamp DESC"
            }
          }
        }, null, 2)
      }]
    };
  }
);

// SQL Best Practices
mcpServer.tool(
  "get_sql_best_practices",
  "Get critical rules and tips for writing efficient Base SQL queries",
  {},
  async () => {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          critical_rules: {
            "1_always_filter_time": {
              rule: "ALWAYS add time filter BEFORE sorting/aggregating",
              why: "Prevents scanning 100GB+ of data",
              example_good: "WHERE block_timestamp > NOW() - INTERVAL 1 DAY ORDER BY block_timestamp DESC",
              example_bad: "ORDER BY block_timestamp DESC (will fail with data limit error)"
            },
            "2_correct_column_names": {
              rule: "Use exact column names from schema",
              common_mistakes: {
                "base.transfers": "Use transaction_to (not transaction_hash), token_address (not contract_address)",
                "base.events": "Use address (not contract_address) for the contract"
              }
            },
            "3_limit_results": {
              rule: "Always use LIMIT",
              why: "Max 100k rows allowed, queries timeout at 30s",
              recommendation: "LIMIT 100 for most queries, LIMIT 1000 max for aggregations"
            },
            "4_use_indexed_columns": {
              rule: "Filter on indexed columns for speed",
              indexed: ["block_number", "block_timestamp", "token_address", "address"],
              tip: "Filtering by these is fast, by other columns is slow"
            }
          },
          performance_tips: [
            "Use specific time ranges (1 hour, 1 day) not open-ended",
            "Filter by token_address/address early in WHERE clause",
            "Use COUNT(*) instead of SELECT * when just counting",
            "Aggregate before joining when possible",
            "Use LIMIT even if you want all results (prevents accidents)"
          ],
          syntax_notes: {
            "time_filters": "NOW() - INTERVAL X HOUR/DAY/WEEK",
            "json_access": "parameters->>'key' for Map types",
            "arrays": "Use IN for array matching",
            "case_sensitive": "Addresses are lowercase in DB"
          }
        }, null, 2)
      }]
    };
  }
);

// Get Contract
mcpServer.tool(
  "get_contract",
  "Get Base mainnet contract address",
  { 
    symbol: z.string().describe("Contract symbol (USDC, WETH, etc.)")
  },
  async ({ symbol }) => {
    const contract = getContract(symbol);
    
    if (!contract) {
      return {
        content: [{ 
          type: "text", 
          text: `Not found. Available: ${Object.keys(BASE_CONTRACTS).join(", ")}` 
        }]
      };
    }
    
    return {
      content: [{ type: "text", text: JSON.stringify(contract, null, 2) }]
    };
  }
);

// Get Template
mcpServer.tool(
  "get_query_template",
  "Get SQL query template",
  { templateKey: z.string() },
  async ({ templateKey }) => {
    const template = QUERY_TEMPLATES[templateKey as QueryTemplateKey];
    if (!template) {
      return {
        content: [{ type: "text", text: `Not found. Available: ${Object.keys(QUERY_TEMPLATES).join(", ")}` }]
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(template, null, 2) }]
    };
  }
);

// Resolve ENS/Basename
mcpServer.tool(
  "resolve_name",
  "Resolve ENS or Basename to Ethereum address",
  { 
    name: z.string().describe("ENS name (vitalik.eth) or Basename (jnix.base.eth)")
  },
  async ({ name }) => {
    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http()
      });
      
      // Get ENS address (viem handles normalization internally)
      const address = await publicClient.getEnsAddress({ name });
      
      if (!address) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: `Could not resolve: ${name}`,
              note: "Name may not exist or resolver not configured"
            }, null, 2)
          }]
        };
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            name: name,
            address: address
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : "Resolution failed",
            name: name
          }, null, 2)
        }]
      };
    }
  }
);

// Reverse ENS Lookup
mcpServer.tool(
  "get_name_for_address",
  "Get ENS/Basename for an Ethereum address (reverse lookup)",
  {
    address: z.string().describe("Ethereum address (0x...)")
  },
  async ({ address }) => {
    try {
      const publicClient = createPublicClient({
        chain: base,
        transport: http()
      });
      
      // Attempt reverse ENS lookup
      const ensName = await publicClient.getEnsName({ 
        address: address as `0x${string}`
      });
      
      if (!ensName) {
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              address: address,
              name: null,
              note: "No ENS/Basename found for this address"
            }, null, 2)
          }]
        };
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            address: address,
            name: ensName,
            displayName: ensName // Human-readable version
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : "Reverse lookup failed",
            address: address
          }, null, 2)
        }]
      };
    }
  }
);

// Execute SQL Query
mcpServer.tool(
  "run_sql_query",
  "Execute a SQL query against Base blockchain data via CDP SQL API",
  {
    sql: z.string().describe("SQL query to execute (SELECT only, ClickHouse dialect)")
  },
  async ({ sql }) => {
    try {
      // Generate JWT for CDP API authentication
      const jwt = await generateJwt({
        apiKeyId: process.env.CDP_API_KEY_ID!,
        apiKeySecret: process.env.CDP_API_KEY_SECRET!,
        requestMethod: "POST",
        requestHost: "api.cdp.coinbase.com",
        requestPath: "/platform/v2/data/query/run",
        expiresIn: 120,
      });

      // Call CDP SQL API
      const response = await fetch('https://api.cdp.coinbase.com/platform/v2/data/query/run', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              error: `SQL API returned ${response.status}`,
              details: errorText
            }, null, 2)
          }]
        };
      }

      const data = await response.json();
      
      return {
        content: [{
          type: "text",
        text: JSON.stringify({
          results: (data as any).result,
          rowCount: (data as any).metadata?.rowCount,
          executionTimeMs: (data as any).metadata?.executionTimeMs
        }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            error: error instanceof Error ? error.message : "Query execution failed"
          }, null, 2)
        }]
      };
    }
  }
);

// Batch Reverse ENS Lookup
mcpServer.tool(
  "get_names_for_addresses",
  "Get ENS/Basename for multiple addresses at once (batch lookup)",
  {
    addresses: z.array(z.string()).describe("Array of Ethereum addresses")
  },
  async ({ addresses }) => {
    const publicClient = createPublicClient({
      chain: base,
      transport: http()
    });
    
    const results = await Promise.allSettled(
      addresses.map(async (address) => {
        try {
          const name = await publicClient.getEnsName({ 
            address: address as `0x${string}`
          });
          return {
            address,
            name: name || null
          };
        } catch {
          return {
            address,
            name: null,
            error: "Lookup failed"
          };
        }
      })
    );
    
    const resolved = results.map((result, i) => 
      result.status === "fulfilled" 
        ? result.value 
        : { address: addresses[i], name: null, error: "Failed" }
    );
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          results: resolved,
          summary: {
            total: addresses.length,
            resolved: resolved.filter(r => r.name).length,
            unresolved: resolved.filter(r => !r.name).length
          }
        }, null, 2)
      }]
    };
  }
);

// HTTP API for testing
const app = express();
app.use(cors());
app.use(express.json());

// GET / - Server info
app.get('/', (req, res) => {
  res.json({
    name: "BaseQL MCP Server",
    version: "1.0.0",
    description: "MCP server for Base SQL API context",
    wallet: wallet.address,
    endpoints: {
      "GET /tools": "List available tools",
      "POST /call": "Call a tool"
    }
  });
});

// GET /tools - List all tools
app.get('/tools', async (req, res) => {
  const tools = [
    { name: "get_schema", description: "Get Base SQL tables" },
    { name: "get_contract", description: "Get contract address", params: ["symbol", "network?"] },
    { name: "get_query_template", description: "Get SQL template", params: ["templateKey"] },
    { name: "resolve_name", description: "ENS to address", params: ["name"] },
    { name: "get_name_for_address", description: "Address to ENS", params: ["address"] },
    { name: "get_names_for_addresses", description: "Batch reverse lookup", params: ["addresses[]"] },
    { name: "run_sql_query", description: "Execute SQL query", params: ["sql"] }
  ];
  res.json({ tools });
});

// POST /call - Call a tool
app.post('/call', async (req, res) => {
  const { tool, params } = req.body;
  
  if (!tool) {
    return res.status(400).json({ error: "Missing 'tool' parameter" });
  }

  try {
    let result;
    
    switch(tool) {
      case "get_schema":
        result = await getSchemaData();
        break;
      case "get_contract":
        result = await getContractData(params?.symbol);
        break;
      case "get_query_template":
        result = await getTemplateData(params?.templateKey);
        break;
      case "run_sql_query":
        result = await runSqlQuery(params?.sql);
        break;
      case "resolve_name":
        result = await resolveName(params?.name);
        break;
      case "get_name_for_address":
        result = await getNameForAddress(params?.address);
        break;
      case "get_names_for_addresses":
        result = await getNamesForAddresses(params?.addresses);
        break;
      default:
        return res.status(404).json({ error: `Unknown tool: ${tool}` });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Tool execution failed" 
    });
  }
});

// Helper functions (extract logic from MCP tools)
async function getSchemaData() {
  return {
    tables: {
      "base.transfers": {
        description: "Token transfers",
        critical_columns: "block_timestamp, token_address, from_address, to_address, value",
        note: "Use token_address NOT contract_address"
      },
      "base.transactions": {
        description: "Transaction data",
        critical_columns: "timestamp (NOT block_timestamp!), transaction_hash, from_address, to_address",
        note: "Use timestamp NOT block_timestamp"
      },
      "base.events": {
        description: "Decoded event logs",
        critical_columns: "block_timestamp, address, event_signature, parameters",
        note: "Use address NOT contract_address, parameters is a Map"
      },
      "base.blocks": {
        description: "Block metadata",
        critical_columns: "timestamp (NOT block_timestamp!), block_number, gas_used",
        note: "Use timestamp NOT block_timestamp"
      },
      "base.encoded_logs": {
        description: "Undecoded logs",
        critical_columns: "block_timestamp, address, topics",
        note: "Raw event data"
      }
    },
    critical_rules: [
      "⚠️ ALWAYS filter by timestamp: WHERE block_timestamp > NOW() - INTERVAL X HOUR",
      "⚠️ base.transfers uses: token_address (not contract_address)",
      "⚠️ base.events uses: address (not contract_address)",
      "⚠️ base.transactions/blocks use: timestamp (not block_timestamp)"
    ]
  };
}

async function getContractData(symbol: string) {
  const contract = getContract(symbol);
  if (!contract) {
    return { error: `Not found. Available: ${Object.keys(BASE_CONTRACTS).join(", ")}` };
  }
  return contract;
}

async function getTemplateData(templateKey: string) {
  const template = QUERY_TEMPLATES[templateKey as QueryTemplateKey];
  if (!template) {
    return { error: `Not found. Available: ${Object.keys(QUERY_TEMPLATES).join(", ")}` };
  }
  return template;
}

async function runSqlQuery(sql: string): Promise<any> {
  const jwt = await generateJwt({
    apiKeyId: process.env.CDP_API_KEY_ID!,
    apiKeySecret: process.env.CDP_API_KEY_SECRET!,
    requestMethod: "POST",
    requestHost: "api.cdp.coinbase.com",
    requestPath: "/platform/v2/data/query/run",
    expiresIn: 120,
  });

  const response = await fetch('https://api.cdp.coinbase.com/platform/v2/data/query/run', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return { error: `SQL API returned ${response.status}`, details: errorText };
  }

  const data: any = await response.json();
  return {
    results: data.result,
    rowCount: data.metadata?.rowCount,
    executionTimeMs: data.metadata?.executionTimeMs
  };
}

async function resolveName(name: string) {
  const publicClient = createPublicClient({ chain: base, transport: http() });
  const address = await publicClient.getEnsAddress({ name });
  
  if (!address) {
    return { error: `Could not resolve: ${name}` };
  }
  
  return { name, address };
}

async function getNameForAddress(address: string) {
  const publicClient = createPublicClient({ chain: base, transport: http() });
  const ensName = await publicClient.getEnsName({ address: address as `0x${string}` });
  return { address, name: ensName || null };
}

async function getNamesForAddresses(addresses: string[]) {
  const publicClient = createPublicClient({ chain: base, transport: http() });
  
  const results = await Promise.allSettled(
    addresses.map(async (address) => {
      const name = await publicClient.getEnsName({ address: address as `0x${string}` });
      return { address, name: name || null };
    })
  );
  
  const resolved = results.map((r, i) => 
    r.status === "fulfilled" ? r.value : { address: addresses[i], name: null }
  );
  
  return {
    results: resolved,
    summary: {
      total: addresses.length,
      resolved: resolved.filter(r => r.name).length
    }
  };
}

// Start HTTP server
app.listen(PORT, () => {
  console.log(`\n🌐 BaseQL MCP HTTP API: http://localhost:${PORT}`);
  console.log(`📋 Try: curl http://localhost:${PORT}/tools`);
  console.log(`\n💡 To enable stdio mode for Claude Desktop, comment out HTTP and uncomment stdio`);
});

// Stdio mode (comment out for HTTP testing)
// const transport = new StdioServerTransport();
// await mcpServer.connect(transport);
// console.log("🤖 BaseQL MCP ready (stdio)");

