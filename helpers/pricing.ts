/**
 * Token pricing from Coinbase Exchange API
 */

interface CoinbaseProduct {
  product_id: string;
  price: string;
  price_percentage_change_24h: string;
  volume_24h: string;
  base_name: string;
  quote_name: string;
  base_currency_id: string;
  quote_currency_id: string;
}

const COINBASE_PRODUCTS_API = "https://api.coinbase.com/api/v3/brokerage/market/products/";

// Cache for product data (refresh every 5 minutes)
let productsCache: CoinbaseProduct[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchProducts(): Promise<CoinbaseProduct[]> {
  const now = Date.now();
  
  // Return cached data if fresh
  if (productsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return productsCache;
  }

  try {
    const response = await fetch(COINBASE_PRODUCTS_API);
    const data = await response.json() as any;
    
    if (data.products) {
      productsCache = data.products;
      cacheTimestamp = now;
      return data.products;
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch Coinbase products:", error);
    return productsCache || [];
  }
}

export async function getTokenPrice(symbol: string) {
  const products = await fetchProducts();
  
  // Normalize symbol (uppercase)
  const normalizedSymbol = symbol.toUpperCase();
  
  // Find USD and USDC pairs for this token
  const usdPair = products.find(p => 
    p.base_currency_id === normalizedSymbol && 
    p.quote_currency_id === "USD"
  );
  
  const usdcPair = products.find(p => 
    p.base_currency_id === normalizedSymbol && 
    p.quote_currency_id === "USDC"
  );
  
  const pair = usdPair || usdcPair;
  
  if (!pair) {
    return {
      symbol: normalizedSymbol,
      price: null,
      error: "Token not found on Coinbase Exchange",
      note: "This pricing data is from Coinbase CEX, not onchain DEX prices"
    };
  }
  
  return {
    symbol: normalizedSymbol,
    name: pair.base_name,
    price_usd: parseFloat(pair.price),
    change_24h_percent: parseFloat(pair.price_percentage_change_24h || "0"),
    volume_24h: parseFloat(pair.volume_24h || "0"),
    trading_pair: pair.product_id,
    quote_currency: pair.quote_name,
    source: "Coinbase Exchange API",
    note: "CEX pricing - may differ from onchain DEX prices on Base"
  };
}

export async function getMultipleTokenPrices(symbols: string[]) {
  const products = await fetchProducts();
  
  const results = symbols.map(symbol => {
    const normalizedSymbol = symbol.toUpperCase();
    
    const usdPair = products.find(p => 
      p.base_currency_id === normalizedSymbol && 
      p.quote_currency_id === "USD"
    );
    
    const usdcPair = products.find(p => 
      p.base_currency_id === normalizedSymbol && 
      p.quote_currency_id === "USDC"
    );
    
    const pair = usdPair || usdcPair;
    
    if (!pair) {
      return {
        symbol: normalizedSymbol,
        price_usd: null,
        error: "Not found on Coinbase"
      };
    }
    
    return {
      symbol: normalizedSymbol,
      name: pair.base_name,
      price_usd: parseFloat(pair.price),
      change_24h_percent: parseFloat(pair.price_percentage_change_24h || "0")
    };
  });
  
  return {
    prices: results,
    source: "Coinbase Exchange API",
    cached: (Date.now() - cacheTimestamp) < CACHE_TTL,
    note: "CEX pricing - may differ from onchain DEX prices on Base"
  };
}

