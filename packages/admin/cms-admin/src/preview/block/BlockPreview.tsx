import { useQuery } from "@apollo/client";
import { Minimize } from "@comet/admin-icons";
import { Grid, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import gql from "graphql-tag";
import { useEffect } from "react";

import { useIFrameBridge } from "../../blocks/iframebridge/useIFrameBridge";
import { useCometConfig } from "../../config/CometConfigContext";
import { useContentScope } from "../../contentScope/Provider";
import { useSiteConfig } from "../../siteConfigs/useSiteConfig";
import { DeviceToggle } from "../common/DeviceToggle";
import { IFrameViewer } from "../common/IFrameViewer";
import { VisibilityToggle } from "../common/VisibilityToggle";
import { type GQLBlockPreviewJwtQuery } from "./BlockPreview.generated";
import { type BlockPreviewApi } from "./useBlockPreview";

interface Props {
    previewApi: BlockPreviewApi;
    url: string;
    previewState: unknown;
}

function BlockPreview({ url, previewState, previewApi: { device, setDevice, showOnlyVisible, setShowOnlyVisible, setMinimized } }: Props) {
    const iFrameBridge = useIFrameBridge();
    const { scope } = useContentScope();

    const { graphQLApiUrl } = useCometConfig();

    useEffect(() => {
        if (iFrameBridge.iFrameReady) {
            iFrameBridge.sendBlockState(previewState);
            iFrameBridge.sendContentScope(scope);
            iFrameBridge.sendGraphQLApiUrl(graphQLApiUrl);
        }
    }, [iFrameBridge, previewState, scope, graphQLApiUrl]);

    const handleMinimizeClick = () => {
        setMinimized((minimized) => !minimized);
    };

    const { blockPreviewApiUrl } = useSiteConfig({ scope });
    const { data, error } = useQuery<GQLBlockPreviewJwtQuery>(
        gql`
            query BlockPreviewJwt($scope: JSONObject!, $url: String!) {
                blockPreviewJwt(scope: $scope, url: $url)
            }
        `,
        {
            fetchPolicy: "network-only",
            variables: {
                scope,
                url,
            },
            pollInterval: 1000 * 60 * 60 * 24, // due to expiration time of jwt
        },
    );

    if (error) throw new Error(error.message);
    if (!data) return <div />;
    const initialPageUrl = `${blockPreviewApiUrl}?${new URLSearchParams({ jwt: data.blockPreviewJwt }).toString()}`;

    return (
        <Root>
            <ActionsContainer>
                <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap" spacing={1}>
                    <Grid>
                        <MinimizeButton onClick={handleMinimizeClick}>
                            <Minimize />
                        </MinimizeButton>
                    </Grid>
                    <Grid>
                        <DeviceToggle device={device} onChange={setDevice} />
                    </Grid>
                    <Grid>
                        <VisibilityToggle showOnlyVisible={showOnlyVisible} onChange={setShowOnlyVisible} />
                    </Grid>
                </Grid>
            </ActionsContainer>
            <IFrameViewer ref={iFrameBridge.iFrameRef} device={device} initialPageUrl={initialPageUrl} />
        </Root>
    );
}

const Root = styled("div")`
    min-width: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const ActionsContainer = styled("div")`
    background-color: ${({ theme }) => theme.palette.grey["A400"]};
    border-radius: 4px 4px 0 0;
`;

const MinimizeButton = styled(IconButton)`
    width: 50px;
    height: 50px;
    border-radius: 0;
    color: ${({ theme }) => theme.palette.common.white};
    border-right: 1px solid #2e3440;
`;

export { BlockPreview };
