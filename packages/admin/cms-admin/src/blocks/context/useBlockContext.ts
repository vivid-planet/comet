import { useApolloClient } from "@apollo/client";
import { useContext } from "react";

import { useCometConfig } from "../../config/CometConfigContext";
import { type BlockContext, CustomBlockContext } from "./BlockContext";

export function useBlockContext(): BlockContext {
    const { apiUrl } = useCometConfig();
    const apolloClient = useApolloClient();
    const customContext = useContext(CustomBlockContext);

    return { ...customContext, apiUrl, apolloClient };
}
