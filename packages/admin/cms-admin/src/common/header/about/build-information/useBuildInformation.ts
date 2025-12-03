import { useCometConfig } from "../../../../config/CometConfigContext";
import { type BuildInformation } from "./buildInformation";

export function useBuildInformation(): BuildInformation | undefined {
    return useCometConfig().buildInformation;
}
