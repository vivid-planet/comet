import { ContentScopeControls, Header, UserHeaderItem } from "@comet/cms-admin";

const MasterHeader = () => {
    return (
        <Header>
            <ContentScopeControls />
            <UserHeaderItem />
        </Header>
    );
};

export default MasterHeader;
