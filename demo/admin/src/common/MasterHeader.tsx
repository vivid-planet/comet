import { BuildEntry, ContentScopeControls, GlobalSearch, Header, UserHeaderItem } from "@comet/cms-admin";

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
