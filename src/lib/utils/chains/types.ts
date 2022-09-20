export enum Chains {
    MAINNET = 1,
    RINKEBY = 4,
    ROPSTEN = 3,
    GOERLI = 5,
    POLYGON = 137,
    MUMBAI = 80001,
    OPTIMISM = 10,
    OPTIMISM_KOVAN = 69,
    OPTIMISM_GOERLI = 420
}

export type CryptoSymbol = "eth" | "usdt" | "usdc" | "busd" | "dai";

export interface NativeCurrencyData { name: string; decimals: number, symbol: CryptoSymbol, isToken?: boolean }

export interface ChainData {
    chainName: string;
    chainId: string;
    nativeCurrency: NativeCurrencyData;
    rpcUrls: string[];
    blockExplorerUrls?: string[];
}
