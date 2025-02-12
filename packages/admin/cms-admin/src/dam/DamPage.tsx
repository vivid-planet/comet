import { styled } from "@mui/material/styles";
import { type ReactNode } from "react";

import { ContentScopeIndicator } from "../contentScope/ContentScopeIndicator";
import { type ContentScopeInterface, useContentScope } from "../contentScope/Provider";
import { DamScopeProvider } from "./config/DamScopeProvider";
import { useDamConfig } from "./config/useDamConfig";
import { useDamScope } from "./config/useDamScope";
import { DamTable } from "./DamTable";

type Props = {
    renderContentScopeIndicator?: (scope: ContentScopeInterface) => ReactNode;
    /**
     * @deprecated Use `additionalToolbarItems` option in `DamConfigProvider` instead
     */
    additionalToolbarItems?: ReactNode;
};

const DefaultContentScopeIndicator = () => {
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

function DamPage({ renderContentScopeIndicator, additionalToolbarItems }: Props) {
    const { scope } = useContentScope();
    const damConfig = useDamConfig();

    return (
        <DamScopeProvider>
            <DamTableWrapper>
                <DamTable
                    contentScopeIndicator={renderContentScopeIndicator ? renderContentScopeIndicator(scope) : <DefaultContentScopeIndicator />}
                    additionalToolbarItems={damConfig.additionalToolbarItems ?? additionalToolbarItems}
                />
            </DamTableWrapper>
        </DamScopeProvider>
    );
}

export { DamPage };
