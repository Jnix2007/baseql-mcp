import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { CdpClient } from "@coinbase/cdp-sdk";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import { BASE_CONTRACTS, getContract } from "./data/contracts.js";
import { QUERY_TEMPLATES } from "./data/queryTemplates.js";
import { runSqlQuery, getTokenAge } from "./helpers/sqlQuery.js";
import { resolveName, getNameForAddress, getNamesForAddresses } from "./helpers/ensLookup.js";
import { getContractData, getContractByAddress } from "./helpers/contractLookup.js";
import { getSchemaData, getTemplateData, getCapabilities, getBestPractices } from "./helpers/metadata.js";
import { registerTools } from "./tools/index.js";

dotenv.config();

const PORT = parseInt(process.env.PORT || "4000");

// initialize CDP wallet (only if payments enabled)
let wallet: any = null;
const ENABLE_PAYMENTS = process.env.ENABLE_PAYMENTS === 'true';

if (ENABLE_PAYMENTS) {
  try {
    if (process.env.CDP_WALLET_SECRET) {
      const cdp = new CdpClient();
      wallet = await cdp.evm.getOrCreateAccount({
        name: "baseql-mcp-wallet"
      });
      console.log(`BaseQL MCP wallet: ${wallet.address} (payments enabled)`);
    } else {
      console.log(`⚠️  ENABLE_PAYMENTS=true but no CDP_WALLET_SECRET - cannot receive payments`);
    }
  } catch (error) {
    console.log(`⚠️  wallet creation failed:`, error instanceof Error ? error.message : error);
  }
} else {
  console.log(`💡 payments disabled (set ENABLE_PAYMENTS=true to monetize)`);
}

// create MCP server
const mcpServer = new McpServer({
  name: "baseql-mcp",
  version: "1.0.0",
});

// register all MCP tools
registerTools(mcpServer);

// HTTP API for testing
const app = express();
app.use(cors());
app.use(express.json());

// GET / - server info
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

// MCP-over-HTTP endpoint (for ChatGPT)
app.post('/', async (req, res) => {
  // set headers for MCP
  if (!req.headers.accept) {
    req.headers.accept = 'application/json, text/event-stream';
  }

  // create transport for this request
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true
  });

  res.on('close', () => {
    transport.close();
  });

  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// GET /tools - list all tools (for testing)
app.get('/tools', async (req, res) => {
  const tools = [
    { name: "get_schema", description: "get Base SQL tables" },
    { name: "get_contract", description: "get contract address", params: ["symbol"] },
    { name: "get_token_age", description: "🚨 CALL FIRST for holder queries! Returns safe time window", params: ["token_address"] },
    { name: "get_sql_best_practices", description: "get SQL best practices" },
    { name: "get_query_template", description: "get SQL template", params: ["templateKey"] },
    { name: "resolve_name", description: "ENS to address", params: ["name"] },
    { name: "get_name_for_address", description: "address to ENS", params: ["address"] },
    { name: "get_names_for_addresses", description: "batch reverse lookup", params: ["addresses[]"] },
    { name: "run_sql_query", description: "execute SQL query", params: ["sql"] }
  ];
  res.json({ tools });
});

// POST /call - call a tool
app.post('/call', async (req, res) => {
  const { tool, params } = req.body;
  
  if (!tool) {
    return res.status(400).json({ error: "missing 'tool' parameter" });
  }

  try {
    let result;
    
    switch(tool) {
      case "get_schema":
        result = await getSchemaData();
        break;
      case "get_schema":
        result = await getSchemaData();
        break;
      case "get_contract":
        result = await getContractData(params?.symbol);
        break;
      case "get_contract_by_address":
        result = await getContractByAddress(params?.address);
        break;
      case "get_query_template":
        result = await getTemplateData(params?.templateKey);
        break;
      case "get_capabilities":
        result = await getCapabilities();
        break;
      case "get_sql_best_practices":
        result = await getBestPractices();
        break;
      case "get_token_age":
        result = await getTokenAge(params?.token_address);
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
      case "get_sql_best_practices":
        result = await getBestPractices();
        break;
      default:
        return res.status(404).json({ error: `unknown tool: ${tool}` });
    }
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "tool execution failed" 
    });
  }
});

// start HTTP server
app.listen(PORT, () => {
  console.log(`\nBaseQL MCP HTTP API: http://localhost:${PORT}`);
  console.log(`try: curl http://localhost:${PORT}/tools`);
});

console.log("BaseQL MCP ready!");

