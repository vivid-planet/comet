import { messages } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { ContentScopeInterface, useContentScope } from "../contentScope/Provider";
import { useContentScopeConfig } from "../contentScope/useContentScopeConfig";
import { DamScopeProvider } from "./config/DamScopeProvider";
import { DamTable } from "./DamTable";

type Props = {
    path: string;
    renderContentScopeIndicator?: (scope: ContentScopeInterface) => React.ReactNode;
};

const defaultRenderContentScopeIndicator = () => (
    <ContentScopeIndicator variant="toolbar" global>
        <ScopeIndicatorContent>
            <Domain fontSize="small" />
            <ScopeIndicatorLabelBold variant="body2">
                <FormattedMessage {...messages.globalContentScope} />
            </ScopeIndicatorLabelBold>
        </ScopeIndicatorContent>
    </ContentScopeIndicator>
);

const ScopeIndicatorLabelBold = styled(Typography)`
    && {
        font-weight: 400;
        padding: 0 8px 0 4px;
        text-transform: uppercase;
    }
`;

const ScopeIndicatorContent = styled("div")`
    display: flex;
    align-items: center;
`;

function DamPage({ path, renderContentScopeIndicator = defaultRenderContentScopeIndicator }: Props): React.ReactElement {
    const { scope } = useContentScope();
    useContentScopeConfig({ redirectPathAfterChange: path });

    return (
        <DamScopeProvider>
            <DamTable contentScopeIndicator={renderContentScopeIndicator(scope)} />
        </DamScopeProvider>
    );
}

export { DamPage };
