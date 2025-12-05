import { BuildEntry, ContentScopeControls, Header, UserHeaderItem } from "@comet/cms-admin";

import { TenantControls } from "./TenantControls";

const MasterHeader = () => {
    return (
        <Header>
            <TenantControls />
            <ContentScopeControls />
            <BuildEntry />
            <UserHeaderItem />
        </Header>
    );
};

export default MasterHeader;
