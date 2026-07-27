import { BuildEntry, ContentScopeControls, Header, SearchHeaderItem, UserHeaderItem } from "@comet/cms-admin";

const MasterHeader = () => {
    return (
        <Header>
            <SearchHeaderItem />
            <ContentScopeControls />
            <BuildEntry />
            <UserHeaderItem />
        </Header>
    );
};

export default MasterHeader;
