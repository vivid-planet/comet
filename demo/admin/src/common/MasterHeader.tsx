import { BuildEntry, ContentScopeControls, Header, UserHeaderItem } from "@comet/cms-admin";

import { GlobalSearch } from "./GlobalSearch";

const MasterHeader = () => {
    return (
        <Header>
            <ContentScopeControls />
            <GlobalSearch />
            <BuildEntry />
            <UserHeaderItem />
        </Header>
    );
};

export default MasterHeader;
