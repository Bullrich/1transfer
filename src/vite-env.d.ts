/// <reference types="svelte" />
/// <reference types="vite/client" />

type EthMethods = "eth_requestAccounts" | "wallet_switchEthereumChain" | "wallet_addEthereumChain";
type MetamaskEvent = "chainChanged"

type RequestParams = { method: EthMethods, params?: any[] };

interface Window {
    ethereum?: {
        request(req: RequestParams): Promise<any>;
        networkVersion: string;
        // as per https://docs.metamask.io/guide/ethereum-provider.html#chainchanged
        on(MetamaskEvent, handler: (chainId: string) => void);
        enable(): Promise<void>;
    }
}
