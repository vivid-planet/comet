import { BuildEntry, Header, UserHeaderItem } from "@comet/admin-cms";
import * as React from "react";

import { ContentScopeControls } from "./ContentScopeProvider";

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
