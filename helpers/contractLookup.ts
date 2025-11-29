/**
 * contract lookup helpers
 */

import { BASE_CONTRACTS, getContract } from "../data/contracts.js";

export async function getContractData(symbol: string) {
  const contract = getContract(symbol);
  if (!contract) {
    return { error: `not found - available: ${Object.keys(BASE_CONTRACTS).join(", ")}` };
  }
  return contract;
}

export async function getContractByAddress(address: string) {
  const lowerAddress = address.toLowerCase();
  const contract = Object.entries(BASE_CONTRACTS).find(
    ([_, info]) => info.address.toLowerCase() === lowerAddress
  );
  
  if (!contract) {
    return {
      address: lowerAddress,
      found: false,
      note: "address not in BaseQL registry"
    };
  }
  
  const info: any = contract[1];
  return {
    address: lowerAddress,
    symbol: info.symbol,
    name: info.name,
    decimals: info.decimals,
    found: true
  };
}

