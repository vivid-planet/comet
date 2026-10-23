import { BuildEntry, ContentScopeControls, Header, SearchHeaderItem, UserHeaderItem } from "@dextinity/cms-admin";

import { UiThemeSwitch } from "./uiTheme/UiThemeSwitch";

const MasterHeader = () => {
    return (
        <Header>
            <SearchHeaderItem />
            <ContentScopeControls />
            <BuildEntry />
            <UserHeaderItem>
                <UiThemeSwitch />
            </UserHeaderItem>
        </Header>
    );
};

export default MasterHeader;
