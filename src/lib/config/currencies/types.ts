import type { NativeCurrencyData } from "../../utils/chains/types";

export interface CurrencyMetadata extends NativeCurrencyData {
    image?:string,
    address:string;
}
