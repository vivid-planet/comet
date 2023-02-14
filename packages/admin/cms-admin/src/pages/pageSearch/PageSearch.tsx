import { styled } from "@mui/material/styles";
import React from "react";

import { SearchInput } from "../../common/SearchInput";
import { PageSearchApi } from "./usePageSearch";

interface PageSearchProps {
    query: string;
    onQueryChange: (query: string) => void;
    pageSearchApi: PageSearchApi;
}

export function PageSearch({ query, onQueryChange, pageSearchApi }: PageSearchProps): React.ReactElement {
    return (
        <Root>
            <SearchInput
                query={query}
                onQueryChange={onQueryChange}
                currentMatch={pageSearchApi.currentMatch}
                totalMatches={pageSearchApi.totalMatches}
                jumpToPreviousMatch={pageSearchApi.jumpToPreviousMatch}
                jumpToNextMatch={pageSearchApi.jumpToNextMatch}
            />
        </Root>
    );
}

const Root = styled("div")`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
`;
