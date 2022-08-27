export const PolygonMumbai = '80001';
export const HarmonyTestnet = '1666700000';
export const HarmonyMainnet = '1666600000';

export const CHAINS: {
  [key: string]: {
    chainName: string,
    rpcUrl: string,
    blockExplorerUrl: string,
    nativeCurrency: string,
    nativeCurrencyDecimals: number,
    testnet: boolean,
  }
} = {
  [PolygonMumbai]: {
    chainName: 'Polygon Mumbai',
    rpcUrl: 'https://rpc-mumbai.matic.today',
    blockExplorerUrl: 'https://mumbai.polygonscan.com/',
    nativeCurrency: 'MATIC',
    nativeCurrencyDecimals: 18,
    testnet: true,
  },
  [HarmonyTestnet]: {
    chainName: 'Harmony Testnet',
    rpcUrl: 'https://api.s0.b.hmny.io',
    blockExplorerUrl: 'https://explorer.pops.one/',
    nativeCurrency: 'ONE',
    nativeCurrencyDecimals: 18,
    testnet: true,
  },
  [HarmonyMainnet]: {
    chainName: 'Harmony',
    rpcUrl: 'https://api.harmony.one',
    blockExplorerUrl: 'https://explorer.harmony.one/',
    nativeCurrency: 'ONE',
    nativeCurrencyDecimals: 18,
    testnet: false,
  },
}

export const isTestnet = (chainId: string | undefined): boolean => {
  return chainId ? CHAINS[chainId]?.testnet : false;
}