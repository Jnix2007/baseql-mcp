/**
 * register all MCP tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { BASE_CONTRACTS, getContract } from "../data/contracts.js";
import { QUERY_TEMPLATES } from "../data/queryTemplates.js";
import { runSqlQuery, getTokenAge } from "../helpers/sqlQuery.js";
import { resolveName, getNameForAddress, getNamesForAddresses } from "../helpers/ensLookup.js";
import { getContractData, getContractByAddress } from "../helpers/contractLookup.js";
import { getSchemaData, getTemplateData, getCapabilities, getBestPractices } from "../helpers/metadata.js";

export function registerTools(mcpServer: McpServer) {
  // schema
  mcpServer.tool("get_schema", "Get Base SQL tables, columns, and best practices", {}, getSchemaData);

  // capabilities
  mcpServer.tool("get_capabilities", "Understand what BaseQL is good at and what it kind of sucks at", {}, getCapabilities);
  
  // best Practices
  mcpServer.tool("get_sql_best_practices", "get important SQL rules", {}, getBestPractices);

  // contracts
  mcpServer.tool("get_contract", "get contract by symbol", { symbol: z.string() }, 
    async ({ symbol }) => {
      const result = await getContractData(symbol);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  mcpServer.tool("get_contract_by_address", "reverse contract lookup", { address: z.string() },
    async ({ address }) => {
      const result = await getContractByAddress(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // templates
  mcpServer.tool("get_query_template", "get SQL template", { templateKey: z.string() },
    async ({ templateKey }) => {
      const result = await getTemplateData(templateKey);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // token Age
  mcpServer.tool("get_token_age", "🚨 REQUIRED for holder queries! Returns safe time window", 
    { token_address: z.string() },
    async ({ token_address }) => {
      const result = await getTokenAge(token_address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // SQL execution
  mcpServer.tool("run_sql_query", "execute SQL against Base", { sql: z.string() },
    async ({ sql }) => {
      const result = await runSqlQuery(sql);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ENS
  mcpServer.tool("resolve_name", "resolve ENS/Basename to wallet address", { name: z.string() },
    async ({ name }) => {
      const result = await resolveName(name);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  mcpServer.tool("get_name_for_address", "resolve wallet address to any associated ENS/Basename", { address: z.string() },
    async ({ address }) => {
      const result = await getNameForAddress(address);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  mcpServer.tool("get_names_for_addresses", "batch reverse lookup", { addresses: z.array(z.string()) },
    async ({ addresses }) => {
      const result = await getNamesForAddresses(addresses);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

