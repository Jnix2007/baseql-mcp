/**
 * metadata & documentation helpers
 */

import { BASE_CONTRACTS } from "../data/contracts.js";
import { QUERY_TEMPLATES } from "../data/queryTemplates.js";

export async function getSchemaData() {
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
    tables: {
      "base.transfers": {
        description: "Token transfer events (ERC-20, ERC-721, ERC-1155)",
        key_columns: {
          block_number: "uint64 - Block containing transfer",
          block_timestamp: "DateTime64 - Block timestamp (ALWAYS FILTER BY THIS!)",
          transaction_to: "String - Transaction recipient",
          transaction_from: "String - Transaction sender",
          token_address: "String - Token contract (lowercase!)",
          from_address: "String - Sender of tokens",
          to_address: "String - Receiver of tokens",
          value: "uint256 - Amount transferred",
          action: "Enum8 - 1=added, -1=reorg removed"
        },
        indexed_fields: ["block_timestamp", "token_address"],
        critical_notes: [
          "Addresses are LOWERCASE in SQL API",
          "Use token_address NOT contract_address",
          "MUST filter by block_timestamp to avoid 100GB scans"
        ]
      },
      "base.events": {
        description: "Decoded event logs from smart contracts",
        key_columns: {
          block_timestamp: "DateTime64 - Time block created",
          address: "String - Contract that emitted log",
          event_signature: "String - Full event declaration (INDEXED - use this!)",
          event_name: "String - Human readable name (NOT INDEXED)",
          parameters: "Map(String, Variant) - Event parameters",
          parameter_types: "Map(String, String) - ABI types",
          transaction_hash: "String - Transaction ID",
          log_index: "uint64 - Log position in transaction"
        },
        indexed_fields: ["event_signature", "address", "block_timestamp"],
        critical_notes: [
          "Filter by event_signature NOT event_name (indexed!)",
          "parameters is a Map - access like: parameters['from']",
          "CANNOT use parameters->> syntax (ClickHouse limitation)",
          "Use address NOT contract_address"
        ]
      },
      "base.transactions": {
        description: "Transaction data including gas and signatures",
        key_columns: {
          timestamp: "DateTime64 - NOT block_timestamp!",
          transaction_hash: "String - Unique transaction ID",
          from_address: "String - Transaction originator (EOA)",
          to_address: "String - Destination (EOA or contract)",
          value: "String - ETH value transferred",
          gas: "uint64 - Gas allocated",
          gas_price: "uint64 - Gas price in wei"
        },
        indexed_fields: ["timestamp", "from_address", "to_address"],
        critical_notes: [
          "Uses timestamp NOT block_timestamp!",
          "MUST filter by timestamp"
        ]
      },
      "base.blocks": {
        description: "Block metadata",
        key_columns: {
          timestamp: "DateTime - NOT block_timestamp!",
          block_number: "uint64 - Block height",
          gas_used: "uint64 - Total gas in block",
          transaction_count: "uint64 - Tx count"
        },
        critical_notes: ["Uses timestamp NOT block_timestamp!"]
      },
      "base.encoded_logs": {
        description: "Raw logs that couldn't be decoded",
        key_columns: {
          block_timestamp: "DateTime64 - Block time",
          address: "String - Contract address",
          topics: "Array(String) - Indexed parameters"
        }
      }
    },
    query_limits: {
      max_rows: 10000,
      timeout: "30 seconds",
      max_joins: 5,
      rate_limit: "100 requests/second"
    },
    data_freshness: "< 500ms from chain tip",
    critical_rules: [
      "🚨 ALWAYS filter by timestamp field (block_timestamp for transfers/events, timestamp for transactions/blocks)",
      "🚨 ALL addresses are LOWERCASE in SQL API",
      "🚨 Use event_signature NOT event_name (indexed!)",
      "🚨 base.transfers: token_address | base.events: address",
      "🚨 parameters is a Map - access like parameters['key']",
      "🚨 CANNOT use parameters->> syntax",
      "🚨 action field: 1=active, -1=reorged out"
    ]
      }, null, 2)
    }]
  };
}

export async function getTemplateData(templateKey: string) {
  const template = (QUERY_TEMPLATES as any)[templateKey];
  if (!template) {
    return { 
      content: [{ type: "text" as const, text: JSON.stringify({ error: `Not found. Available: ${Object.keys(QUERY_TEMPLATES).join(", ")}` }, null, 2) }]
    };
  }
  return {
    content: [{ type: "text" as const, text: JSON.stringify(template, null, 2) }]
  };
}

export async function getCapabilities() {
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
    what_works_great: {
      recent_activity: "1-7 day windows",
      token_discovery: "Trending, new launches",
      event_monitoring: "Swaps, mints, attestations"
    },
    what_fails: {
      historical_balances: "100GB scan limit",
      complex_unions: "500 errors",
      long_windows: "90+ days on popular tokens"
    }
      }, null, 2)
    }]
  };
}

export async function getBestPractices() {
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
    performance_optimization: {
      indexed_fields: [
        "✅ ALWAYS use indexed fields in WHERE clauses",
        "base.events: event_signature, address, block_timestamp",
        "base.transfers: token_address, block_timestamp",
        "base.transactions: timestamp, from_address, to_address"
      ],
      time_filtering: [
        "🚨 Use specific block ranges via timestamp fields",
        "❌ BAD: WHERE token_address = '0x...' (full table scan!)",
        "✅ GOOD: WHERE token_address = '0x...' AND block_timestamp > NOW() - INTERVAL 1 DAY",
        "For popular tokens (USDC, WETH): Use < 7 day windows",
        "For new tokens: get_token_age tells you safe window"
      ],
      query_patterns: [
        "✅ Filter early in WHERE clauses",
        "✅ SELECT only columns you need (avoid SELECT *)",
        "✅ Use event_signature NOT event_name (indexed!)",
        "❌ Avoid OR in JOINs (use UNION instead)",
        "❌ Complex aggregations on large time windows will timeout"
      ]
    },
    holder_query_workflow: {
      step_1: "Call get_token_age(token_address) FIRST",
      step_2: "Use returned safe_window in your query",
      step_3: "Query with: block_timestamp > NOW() - INTERVAL {safe_window}",
      why: "Prevents 100GB scan errors on popular tokens"
    },
    common_errors: {
      "Limit for rows to read exceeded": "Add tighter time filter (smaller INTERVAL)",
      "Query timeout (30s)": "Reduce block range, filter by event_signature first",
      "Unknown identifier": "Check column names in get_schema",
      "Type mismatch": "Cast explicitly: toInt256(value), toString(field)"
    },
    clickhouse_specific: {
      map_access: "Use parameters['key'] NOT parameters->>'key'",
      casting: "Use toInt256(), toUInt256(), toString() functions",
      arrays: "Array functions: arrayJoin, arrayFilter, arrayMap",
      date_intervals: "NOW() - INTERVAL 1 HOUR/DAY/WEEK"
    },
    address_handling: {
      critical: "ALL addresses are LOWERCASE in SQL API!",
      example: "Use '0x833589fcd...' NOT '0x833589FCD...'",
      tip: "Always .toLowerCase() addresses before queries"
    }
      }, null, 2)
    }]
  };
}

