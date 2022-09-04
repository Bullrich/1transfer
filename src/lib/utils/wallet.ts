import { providers } from "ethers";

export const getSigner = async () => {
    const ethereum = (window as any).ethereum;
    await ethereum.enable();
    const provider = new providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return signer;
}
