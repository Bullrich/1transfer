export enum Chains {
    MAINNET = 1,
    RINKEBY = 4,
    ROPSTEN = 3,
    POLYGON = 137,
    MUMBAI = 80001,
    OPTIMISM = 10,
    OPTIMISM_KOVAN = 69,
    OPTIMISM_GOERLI = 420
}

export interface ChainData {
    chainName: string;
    chainId: string;
    nativeCurrency: { name: string; decimals: number, symbol: string };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
}