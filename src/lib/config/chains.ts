import { utils } from "ethers";
import { Chains, type ChainData } from "../utils/chains/types";

const polygon: ChainData = {
    chainName: 'Polygon Mainnet',
    chainId: utils.hexValue(Chains.POLYGON),
    nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'matic' },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/']
};

const mumbai: ChainData = {
    chainName: 'Polygon Mumbai',
    chainId: utils.hexValue(Chains.MUMBAI),
    nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'matic' },
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
};

const optimism: ChainData = {
    chainName: 'Optimism',
    chainId: utils.hexValue(Chains.OPTIMISM),
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'eth' },
    rpcUrls: ['https://mainnet.optimism.io'],
    blockExplorerUrls: ['https://optimistic.etherscan.io/']
};

const optimismKovan: ChainData = {
    chainName: 'Optimism Kovan',
    chainId: utils.hexValue(Chains.OPTIMISM_KOVAN),
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'eth' },
    rpcUrls: ['https://kovan.optimism.io'],
    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io/']
};

const optimismGoerli: ChainData = {
    chainName: 'Optimism Goerli',
    chainId: utils.hexValue(Chains.OPTIMISM_GOERLI),
    nativeCurrency: { name: 'KOR', decimals: 18, symbol: 'eth' },
    rpcUrls: ['https://goerli.optimism.io'],
    blockExplorerUrls: ['https://blockscout.com/optimism/goerli/']
};

export const chainData: Map<Chains, ChainData> = new Map<Chains, ChainData>([
    [Chains.POLYGON, polygon],
    [Chains.MUMBAI, mumbai],
    [Chains.OPTIMISM_KOVAN, optimismKovan],
    [Chains.OPTIMISM, optimism],
    [Chains.OPTIMISM_GOERLI, optimismGoerli]
]
);

/** List of chains that are supported by the production app */
export const supportedChains:Chains[] = [Chains.MAINNET, Chains.POLYGON, Chains.OPTIMISM];
