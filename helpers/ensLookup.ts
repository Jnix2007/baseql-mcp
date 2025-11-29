/**
 * ENS/Basename resolution helpers
 */

import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export async function resolveName(name: string) {
  const publicClient = createPublicClient({ 
    chain: mainnet,
    transport: http()
  });
  const address = await publicClient.getEnsAddress({ name });
  
  if (!address) {
    return { error: `could not resolve: ${name}` };
  }
  
  return { name, address };
}

export async function getNameForAddress(address: string) {
  const publicClient = createPublicClient({ 
    chain: mainnet,
    transport: http()
  });
  const ensName = await publicClient.getEnsName({ address: address as `0x${string}` });
  return { address, name: ensName || null };
}

export async function getNamesForAddresses(addresses: string[]) {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
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
}

