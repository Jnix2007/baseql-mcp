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
        description: "token transfers",
        critical_columns: "block_timestamp, token_address, from_address, to_address, value",
        note: "use token_address not contract_address"
      },
      "base.transactions": {
        description: "transaction data",
        critical_columns: "timestamp (NOT block_timestamp!), transaction_hash, from_address, to_address",
        note: "use timestamp not block_timestamp"
      },
      "base.events": {
        description: "decoded event logs",
        critical_columns: "block_timestamp, address, event_signature, parameters",
        note: "use address not contract_address; parameters is a Map"
      },
      "base.blocks": {
        description: "block metadata",
        critical_columns: "timestamp (NOT block_timestamp!), block_number, gas_used",
        note: "use timestamp NOT block_timestamp"
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
    critical_rules: [
      "🚨 For holder queries: Call get_token_age FIRST!",
      "🚨 Use suggested window from get_token_age",
      "✅ Workflow: get_token_age → use window → query"
    ]
      }, null, 2)
    }]
  };
}

