import { EditDialogApiContext, messages, useEditDialog } from "@comet/admin";
import { Domain } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { useRouteMatch } from "react-router";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { ContentScopeInterface, useContentScope } from "../contentScope/Provider";
import { useContentScopeConfig } from "../contentScope/useContentScopeConfig";
import { DamScopeProvider } from "./config/DamScopeProvider";
import { useDamConfig } from "./config/useDamConfig";
import { DamTable } from "./DamTable";

type Props = {
    renderContentScopeIndicator?: (scope: ContentScopeInterface) => React.ReactNode;
    /**
     * @deprecated Use `additionalToolbarItems` option in `DamConfigProvider` instead
     */
    additionalToolbarItems?: React.ReactNode;
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

const DamTableWrapper = styled("div")`
    display: grid;
    height: calc(100vh - var(--comet-admin-master-layout-content-top-spacing));
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
`;

function DamPage({ renderContentScopeIndicator = defaultRenderContentScopeIndicator, additionalToolbarItems }: Props): React.ReactElement {
    const { scope, match } = useContentScope();
    const routeMatch = useRouteMatch();
    const damRouteLocation = routeMatch.url.replace(match.url, "");
    useContentScopeConfig({ redirectPathAfterChange: damRouteLocation });
    const damConfig = useDamConfig();
    const [EditDialog, selection, editDialogApi, selectionApi] = useEditDialog();

    return (
        <DamScopeProvider>
            <EditDialogApiContext.Provider value={editDialogApi}>
                <DamTableWrapper>
                    <DamTable
                        contentScopeIndicator={renderContentScopeIndicator(scope)}
                        additionalToolbarItems={damConfig.additionalToolbarItems ?? additionalToolbarItems}
                    />
                </DamTableWrapper>
                <EditDialog />
            </EditDialogApiContext.Provider>
        </DamScopeProvider>
    );
}

export { DamPage };
