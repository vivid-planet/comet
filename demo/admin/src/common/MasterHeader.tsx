import { BuildEntry, ContentScopeControls, Header, UserHeaderItem } from "@comet/cms-admin";
import * as React from "react";

const MasterHeader: React.FC = () => {
    return (
        <Header>
            <ContentScopeControls />
            <BuildEntry />
            <UserHeaderItem />
        </Header>
    );
};

export default MasterHeader;
