import { useApolloClient } from "@apollo/client";
import { ArrowRight, OpenNewTab } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useHistory } from "react-router";

import { useContentScope } from "../contentScope/Provider";
import { useDependenciesConfig } from "../dependencies/DependenciesConfig";
import { type DependencyInterface } from "../dependencies/types";

interface Props {
    sourceInfo: {
        rootEntityName: string;
        targetId: string;
        jsonPath?: string;
        rootColumnName?: string;
    };
}

export function WarningActions({ sourceInfo }: Props) {
    const history = useHistory();
    const entityDependencyMap = useDependenciesConfig();
    const apolloClient = useApolloClient();
    const contentScope = useContentScope();
    const dependencyObject = entityDependencyMap[sourceInfo.rootEntityName] as DependencyInterface | undefined;

    if (!dependencyObject) return null; // to some warnings it cannot be linked to. When missing a dependency or for example a failing job cannot be resolved in the admin and therefore cannot have a link

    if (dependencyObject === undefined) {
        if (process.env.NODE_ENV === "development") {
            console.warn(
                `Cannot load URL because no implementation of DependencyInterface for ${
                    sourceInfo.rootEntityName
                } was provided via the DependenciesConfig`,
            );
        }
        return <FormattedMessage id="comet.dependencies.dataGrid.cannotLoadUrl" defaultMessage="Cannot determine URL" />;
    }

    const loadUrl = async () => {
        const path = await dependencyObject.resolvePath({
            rootColumnName: sourceInfo.rootColumnName,
            jsonPath: sourceInfo.jsonPath,
            apolloClient,
            id: sourceInfo.targetId,
        });
        return contentScope.match.url + path;
    };

    return (
        <div style={{ display: "flex" }}>
            <IconButton
                onClick={async () => {
                    const url = await loadUrl();
                    window.open(url, "_blank");
                }}
            >
                <OpenNewTab />
            </IconButton>
            <IconButton
                onClick={async () => {
                    const url = await loadUrl();

                    history.push(url);
                }}
            >
                <ArrowRight />
            </IconButton>
        </div>
    );
}
