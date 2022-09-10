import { providers } from "ethers";

export const getSigner = async () => {
    const ethereum = window.ethereum;
    const provider = new providers.Web3Provider(ethereum);
    await ethereum.enable();
    const signer = provider.getSigner();
    return signer;
}

export const getAccounts = async ():Promise<string[]> => {
    const ethereum = window.ethereum;
    if(!ethereum) {
        return [];
    }
    const provider = new providers.Web3Provider(ethereum);
    return provider.listAccounts();
}
