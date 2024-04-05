import { Minimize } from "@comet/admin-icons";
import { useIFrameBridge } from "@comet/blocks-admin";
import { Grid, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { useContentScope } from "../../contentScope/Provider";
import { DeviceToggle } from "../common/DeviceToggle";
import { IFrameViewer } from "../common/IFrameViewer";
import { VisibilityToggle } from "../common/VisibilityToggle";
import { BlockPreviewApi } from "./useBlockPreview";

interface Props {
    previewApi: BlockPreviewApi;
    url: string;
    previewState: unknown;
}

function BlockPreview({
    url,
    previewState,
    previewApi: { device, setDevice, showOnlyVisible, setShowOnlyVisible, setMinimized },
}: Props): React.ReactElement {
    const iFrameBridge = useIFrameBridge();
    const { scope } = useContentScope();

    React.useEffect(() => {
        if (iFrameBridge.iFrameReady) {
            iFrameBridge.sendBlockState(previewState);
        }
        if (iFrameBridge.iFrameReady) {
            iFrameBridge.sendContentScope(scope);
        }
    }, [iFrameBridge, previewState, scope]);

    const handleMinimizeClick = () => {
        setMinimized((minimized) => !minimized);
    };
    return (
        <Root>
            <ActionsContainer>
                <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap" spacing={1}>
                    <Grid item>
                        <MinimizeButton onClick={handleMinimizeClick}>
                            <Minimize />
                        </MinimizeButton>
                    </Grid>
                    <Grid item>
                        <DeviceToggle device={device} onChange={setDevice} />
                    </Grid>
                    <Grid item>
                        <VisibilityToggle showOnlyVisible={showOnlyVisible} onChange={setShowOnlyVisible} />
                    </Grid>
                </Grid>
            </ActionsContainer>
            <IFrameViewer ref={iFrameBridge.iFrameRef} device={device} initialPageUrl={url} />
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
