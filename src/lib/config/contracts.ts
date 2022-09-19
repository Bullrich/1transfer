import { Chains } from "../utils/chains";

const OPTIMISM_KOVAN = "0xfd82641C1B3355d283cd03C8ef1DcD87ACBeFBA2";
const OPTIMISM_GOERLI = "0xe7ac80f3E0630757a580CE10EC3a9BbF2727B882";
const RINKEBY = "0x0DcC81857eabbeB9d9e6769b36eA9e7Cb5704487";

export function getContractAddress(chain: Chains): string {
    switch (chain) {
        case Chains.OPTIMISM_KOVAN:
            return OPTIMISM_KOVAN;
        case Chains.OPTIMISM_GOERLI:
            return OPTIMISM_GOERLI;
        case Chains.RINKEBY:
            return RINKEBY;
        default:
            return null;
    }
}
