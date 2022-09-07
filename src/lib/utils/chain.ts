import { utils } from "ethers";

export enum Chains {
    MAINNET = 1,
    RINKEBY = 4,
    ROPSTEN = 3,
    POLYGON = 137,
    MUMBAI = 80001,
    OPTIMISM = 10,
    OPTIMISM_KOVAN = 69
}

interface ChainData {
    chainName: string;
    chainId: string;
    nativeCurrency: { name: string; decimals: number, symbol: string };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
}

export const getChainCollection = (): { name: string; id: Chains }[] => {
    const collection: { name: string; id: Chains }[] = [];
    for (const chain in Chains) {
        const isValueProperty = Number(chain) >= 0
        if (isValueProperty) {
            const name: string = Chains[chain];
            const upperCaseName = name.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()).replace(/\_/, " ");
            collection.push({ name: upperCaseName, id: Number(chain) });
        }
    }
    return collection;
}

/** Returns true if the network is inside our list of enum networks */
export const isKnownNetwork = (id:number) => Object.values(Chains).includes(id as Chains);

export const changeNetwork = async (chainId: number): Promise<void> => {
    return new Promise((res, rej) => {
        if (window.ethereum.networkVersion === chainId.toString()) {
            return res();
        }
        window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: utils.hexValue(chainId) }],
        }).then(() => res())
            .catch(err => {
                console.warn("Could not connect to chain", chainId);
                return rej(err);
            });
    });
}
