/**
 * SQL Query execution helpers
 */

import { generateJwt } from "@coinbase/cdp-sdk/auth";

export async function runSqlQuery(sql: string): Promise<any> {
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

export async function getTokenAge(token_address: string) {
  const sql = `
SELECT 
  MIN(block_timestamp) as first_transfer,
  MAX(block_timestamp) as last_transfer,
  COUNT(*) as total_transfers,
  dateDiff('day', MIN(block_timestamp), NOW()) as days_old
FROM base.transfers
WHERE token_address = '${token_address.toLowerCase()}'
`;

  const result = await runSqlQuery(sql);
  
  if (result.error) return result;
  
  if (result.results && result.results.length > 0) {
    const data = result.results[0];
    const daysOld = parseInt(data.days_old);
    const suggestedDays = Math.min(Math.ceil(daysOld * 1.2), 365);
    
    return {
      first_transfer: data.first_transfer,
      days_old: daysOld,
      suggested_query_window: `${suggestedDays} days`,
      recommendation: `Use ${suggestedDays} in queries`
    };
  }
  
  return { error: "No transfers found" };
}

