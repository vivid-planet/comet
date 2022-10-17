import { CometColor } from "@comet/admin-icons";
import { IFrameBridgeProvider, IFrameLocationMessage, IFrameMessageType } from "@comet/blocks-admin";
import { Public, VpnLock } from "@mui/icons-material";
import { Grid, Tooltip, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { RouteComponentProps, useHistory } from "react-router";

import { ExternalLinkBlockData } from "../blocks.generated";
import { ContentScopeInterface, useContentScope } from "../contentScope/Provider";
import { useSiteConfig } from "../sitesConfig/useSiteConfig";
import { buildPreviewUrl } from "./buildPreviewUrl";
import { DeviceToggle } from "./DeviceToggle";
import { IFrameViewer } from "./IFrameViewer";
import { OpenLinkDialog } from "./OpenLinkDialog";
import { ActionsContainer, LogoWrapper, Root, SiteInformation, SiteLink, SiteLinkWrapper } from "./SitePreview.sc";
import { Device } from "./types";
import { VisibilityToggle } from "./VisibilityToggle";

interface SiteState {
    includeInvisibleBlocks: boolean;
}

interface Props extends RouteComponentProps {
    resolvePath?: (path: string, scope: ContentScopeInterface) => string;
    logo?: React.ReactNode;
}

function SitePreview({ location, resolvePath, logo = <CometColor sx={{ fontSize: 32 }} /> }: Props): React.ReactElement {
    const queryParams = new URLSearchParams(location.search);

    const [previewPath, setPreviewPath] = React.useState<string>(queryParams.get("path") || "");

    const [device, setDevice] = React.useState<Device>(() => {
        const deviceParam = queryParams.get("device");

        if (deviceParam !== null && [Device.Responsive, Device.Mobile, Device.Tablet, Device.Desktop].includes(Number(deviceParam))) {
            return Number(deviceParam) as Device;
        } else {
            return Device.Responsive;
        }
    });

    const [showOnlyVisible, setShowOnlyVisible] = React.useState<boolean>(() => {
        const showOnlyVisibleParam = queryParams.get("showOnlyVisible");

        if (showOnlyVisibleParam === null) {
            return true;
        }

        return showOnlyVisibleParam === "true";
    });
    const [linkToOpen, setLinkToOpen] = React.useState<ExternalLinkBlockData | undefined>(undefined);
    const siteState: SiteState = { includeInvisibleBlocks: !showOnlyVisible };
    const formattedSiteState = JSON.stringify(siteState);

    const { scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });

    const [initialPageUrl, setInitialPageUrl] = React.useState(buildPreviewUrl(siteConfig.previewUrl, previewPath, formattedSiteState));

    // update the initialPreviewUrl when previewState changes
    // the iframe is then force-rerendered with the new preViewUrl
    React.useEffect(() => {
        // react-hooks/exhaustive-deps is disabled because the src-prop of iframe is uncontrolled
        // the src-value is just the default value, the iframe keeps its own src-state (by clicking links inside the iframe)
        setInitialPageUrl(buildPreviewUrl(siteConfig.previewUrl, previewPath, formattedSiteState));
    }, [formattedSiteState]); // eslint-disable-line react-hooks/exhaustive-deps

    const history = useHistory();
    const intl = useIntl();

    // the site in the iframe notifies us about it's current location
    // we sync the location back to our admin-url, so we have it and can reload the page without loosing
    const handlePreviewLocationChange = React.useCallback(
        (message: IFrameLocationMessage) => {
            // the location in the iframe must start with /preview
            if (message.data.pathname.search("/preview") === 0) {
                // this is the original-pathname of the site, we extract it and keep it in "our" url as get-param
                let normalizedPathname = message.data.pathname.substr("/preview".length);
                if (normalizedPathname == "") normalizedPathname = "/";
                if (previewPath !== normalizedPathname) {
                    setPreviewPath(normalizedPathname);
                    const newQueryParams = new URLSearchParams(location.search);
                    newQueryParams.set("path", normalizedPathname);
                    history.push({ search: newQueryParams.toString() });
                }
            }
        },
        [previewPath, history, location.search],
    );

    const handleDeviceChange = (newDevice: Device) => {
        setDevice(newDevice);

        const newQueryParams = new URLSearchParams(location.search);
        newQueryParams.set("device", String(newDevice));

        history.replace({ search: newQueryParams.toString() });
    };

    const handleShowOnlyVisibleChange = () => {
        const newShowOnlyVisible = !showOnlyVisible;

        setShowOnlyVisible(newShowOnlyVisible);

        const newQueryParams = new URLSearchParams(location.search);
        newQueryParams.set("showOnlyVisible", String(newShowOnlyVisible));

        history.replace({ search: newQueryParams.toString() });
    };

    const siteLink = `${siteConfig.url}${resolvePath ? resolvePath(previewPath, scope) : previewPath}`;

    return (
        <IFrameBridgeProvider
            onReceiveMessage={(message) => {
                switch (message.cometType) {
                    case IFrameMessageType.OpenLink:
                        setLinkToOpen(message.data.link);
                        break;
                    case IFrameMessageType.SitePreviewLocation:
                        handlePreviewLocationChange(message);
                        break;
                }
            }}
        >
            <Root>
                <IFrameViewer device={device} initialPageUrl={initialPageUrl} />
                <ActionsContainer>
                    <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
                        <Grid item>
                            <SiteInformation>
                                <LogoWrapper>
                                    {logo}
                                    <Typography textTransform="uppercase" color="white">
                                        <FormattedMessage defaultMessage="Preview" id="comet.sitePreview.preview" />
                                    </Typography>
                                </LogoWrapper>
                                <SiteLinkWrapper>
                                    {siteConfig.preloginEnabled ? (
                                        <Tooltip
                                            title={intl.formatMessage({
                                                id: "comet.sitePreview.sitePreloginEnabledMessage",
                                                defaultMessage: "Site is not yet publicly available",
                                            })}
                                        >
                                            <VpnLock />
                                        </Tooltip>
                                    ) : (
                                        <Public />
                                    )}
                                    <SiteLink variant="body1" href={siteLink} target="_blank">
                                        {siteLink}
                                    </SiteLink>
                                </SiteLinkWrapper>
                            </SiteInformation>
                        </Grid>
                        <Grid item>
                            <DeviceToggle device={device} onChange={handleDeviceChange} />
                        </Grid>
                        <Grid item>
                            <VisibilityToggle showOnlyVisible={showOnlyVisible} onChange={handleShowOnlyVisibleChange} />
                        </Grid>
                    </Grid>
                </ActionsContainer>
                <OpenLinkDialog
                    open={linkToOpen != null}
                    onClose={() => {
                        setLinkToOpen(undefined);
                    }}
                    link={linkToOpen}
                />
            </Root>
        </IFrameBridgeProvider>
    );
}

export { SitePreview };
