import { BuildEntry, ContentScopeControls, Header, UserHeaderItem } from "@comet/cms-admin";

const MasterHeader = () => {
    return (
        <Header>
            <ContentScopeControls />
            <BuildEntry />
            <UserHeaderItem />
        </Header>
    );
};

export default MasterHeader;
