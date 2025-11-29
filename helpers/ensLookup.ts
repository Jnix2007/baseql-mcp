/**
 * ENS/Basename resolution helpers
 */

import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

// Use Flashbots RPC for ENS resolution (supports both ENS and Basenames)
const ETH_RPC = "https://rpc.flashbots.net";

export async function resolveName(name: string) {
  try {
    const publicClient = createPublicClient({ 
      chain: mainnet,
      transport: http(ETH_RPC, { timeout: 10000 })
    });
    const address = await publicClient.getEnsAddress({ name });
    
    if (!address) {
      return { error: `could not resolve: ${name}` };
    }
    
    return { name, address };
  } catch (error) {
    return { 
      error: `ENS resolution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      name 
    };
  }
}

export async function getNameForAddress(address: string) {
  try {
    const publicClient = createPublicClient({ 
      chain: mainnet,
      transport: http(ETH_RPC, { timeout: 10000 })
    });
    const ensName = await publicClient.getEnsName({ address: address as `0x${string}` });
    return { address, name: ensName || null };
  } catch (error) {
    return { 
      address, 
      name: null,
      error: `Reverse lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function getNamesForAddresses(addresses: string[]) {
  try {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(ETH_RPC, { timeout: 10000 })
    });
    
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
  } catch (error) {
    return {
      error: `Batch lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      results: addresses.map(address => ({ address, name: null }))
    };
  }
}

