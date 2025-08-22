import { useApolloClient } from "@apollo/client";
import { useContext } from "react";

import { useCometConfig } from "../../config/CometConfigContext";
import { useDamBasePath } from "../../dam/config/damConfig";
import { type BlockContext, CustomBlockContext } from "./BlockContext";

export function useBlockContext(): BlockContext {
    const { apiUrl } = useCometConfig();
    const damBasePath = useDamBasePath();
    const apolloClient = useApolloClient();
    const customContext = useContext(CustomBlockContext);

    return { ...customContext, apiUrl, apolloClient, damBasePath };
}
