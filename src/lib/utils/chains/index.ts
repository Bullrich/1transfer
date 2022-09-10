import { utils } from "ethers";
import { Chains, type ChainData } from "./chain";

const polygon: ChainData = {
    chainName: 'Polygon Mainnet',
    chainId: utils.hexValue(Chains.POLYGON),
    nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/']
};

const polygonMumbai: ChainData = {
    chainName: 'Polygon Mumbai',
    chainId: utils.hexValue(Chains.MUMBAI),
    nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/']
};

const optimismKovan: ChainData = {
    chainName: 'Optimism Kovan',
    chainId: utils.hexValue(Chains.OPTIMISM_KOVAN),
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    rpcUrls: ['https://kovan.optimism.io'],
    blockExplorerUrls: ['https://kovan-optimistic.etherscan.io/']
};

const chainData: Map<Chains, ChainData> = new Map<Chains, ChainData>([[Chains.POLYGON, polygon], [Chains.MUMBAI, polygonMumbai], [Chains.OPTIMISM_KOVAN, optimismKovan]]);

export function getChain(chain: Chains): ChainData {
    return chainData.get(chain);
}
