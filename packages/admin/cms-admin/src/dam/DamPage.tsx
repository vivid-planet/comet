import { styled } from "@mui/material/styles";
import * as React from "react";
import { useRouteMatch } from "react-router";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { ContentScopeInterface, useContentScope } from "../contentScope/Provider";
import { useContentScopeConfig } from "../contentScope/useContentScopeConfig";
import { DamScopeProvider } from "./config/DamScopeProvider";
import { useDamConfig } from "./config/useDamConfig";
import { useDamScope } from "./config/useDamScope";
import { DamTable } from "./DamTable";

type Props = {
    renderContentScopeIndicator?: (scope: ContentScopeInterface) => React.ReactNode;
    /**
     * @deprecated Use `additionalToolbarItems` option in `DamConfigProvider` instead
     */
    additionalToolbarItems?: React.ReactNode;
};

const DefaultRenderContentScopeIndicator = () => {
    const damScope = useDamScope();

    if (Object.keys(damScope).length > 0) {
        return <ContentScopeIndicator scope={damScope} />;
    } else {
        return <ContentScopeIndicator global />;
    }
};

const DamTableWrapper = styled("div")`
    display: grid;
    height: calc(100vh - var(--comet-admin-master-layout-content-top-spacing));
    grid-template-columns: 1fr;
    grid-template-rows: max-content;
`;

function DamPage({ renderContentScopeIndicator, additionalToolbarItems }: Props): React.ReactElement {
    const { scope, match } = useContentScope();
    const routeMatch = useRouteMatch();
    const damRouteLocation = routeMatch.url.replace(match.url, "");
    useContentScopeConfig({ redirectPathAfterChange: damRouteLocation });
    const damConfig = useDamConfig();

    return (
        <DamScopeProvider>
            <DamTableWrapper>
                <DamTable
                    contentScopeIndicator={renderContentScopeIndicator ? renderContentScopeIndicator(scope) : <DefaultRenderContentScopeIndicator />}
                    additionalToolbarItems={damConfig.additionalToolbarItems ?? additionalToolbarItems}
                />
            </DamTableWrapper>
        </DamScopeProvider>
    );
}

export { DamPage };
