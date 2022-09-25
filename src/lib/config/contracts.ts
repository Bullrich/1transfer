import { Chains } from "../utils/chains";

const OPTIMISM_KOVAN = "0xfd82641C1B3355d283cd03C8ef1DcD87ACBeFBA2";
const OPTIMISM_GOERLI = "0x9ab42Bb61B0b161196f4300b567fAb44ee035e72";
const RINKEBY = "0x0DcC81857eabbeB9d9e6769b36eA9e7Cb5704487";
const GOERLI = "0xdefacadafc5907c8c6c2babdf9acf964ceb6f972";
const MAINNET = "0x0eC74463be41B6145980bB3fd3e54eC983738E9a";
const OPTIMISM = "0xb2ace012e6787e63e97e20dcf6338d2b4a1f41c6";
const POLYGON = "0x81025813e9fc8590a4b4767a75ff9d9fe185b868";

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
        case Chains.OPTIMISM:
            return OPTIMISM;
        case Chains.POLYGON:
            return POLYGON;
        default:
            return null;
    }
}
