import { Chains } from "../utils/chains";

const OPTIMISM_KOVAN = "0xfd82641C1B3355d283cd03C8ef1DcD87ACBeFBA2";
const OPTIMISM_GOERLI = "0x9ab42Bb61B0b161196f4300b567fAb44ee035e72";
const RINKEBY = "0x0DcC81857eabbeB9d9e6769b36eA9e7Cb5704487";
const GOERLI = "0x4a7789c3320d5fE208f65a6aF14Da3FF5b7A6fbf";
const MAINNET = "0x0eC74463be41B6145980bB3fd3e54eC983738E9a";

export function getContractAddress(chain: Chains): string {
    switch (chain) {
        case Chains.OPTIMISM_KOVAN:
            return OPTIMISM_KOVAN;
        case Chains.OPTIMISM_GOERLI:
            return OPTIMISM_GOERLI;
        case Chains.RINKEBY:
            return RINKEBY;
        case Chains.GOERLI:
            return GOERLI;
        case Chains.MAINNET:
            return MAINNET;
        default:
            return null;
    }
}
