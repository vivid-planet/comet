import { CometColor, Domain, DomainLocked } from "@comet/admin-icons";
import { Grid, Tooltip, Typography } from "@mui/material";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { RouteComponentProps, useHistory, useLocation } from "react-router";

import { ExternalLinkBlockData } from "../../blocks.generated";
import { ContentScopeInterface, useContentScope } from "../../contentScope/Provider";
import { useSiteConfig } from "../../sitesConfig/useSiteConfig";
import { Device } from "../common/Device";
import { DeviceToggle } from "../common/DeviceToggle";
import { IFrameViewer } from "../common/IFrameViewer";
import { VisibilityToggle } from "../common/VisibilityToggle";
import { buildPreviewUrl } from "./buildPreviewUrl";
import { SitePrevewIFrameLocationMessage, SitePreviewIFrameMessageType } from "./iframebridge/SitePreviewIFrameMessage";
import { useSitePreviewIFrameBridge } from "./iframebridge/useSitePreviewIFrameBridge";
import { OpenLinkDialog } from "./OpenLinkDialog";
import { ActionsContainer, LogoWrapper, Root, SiteInformation, SiteLink, SiteLinkWrapper } from "./SitePreview.sc";

interface SitePreviewParams {
    includeInvisibleBlocks: boolean;
}

//TODO v4 remove RouteComponentProps
interface Props extends RouteComponentProps {
    resolvePath?: (path: string, scope: ContentScopeInterface) => string;
    logo?: React.ReactNode;
}

function useSearchState<ParseFunction extends (value: string | undefined) => ReturnType<ParseFunction>>(
    name: string,
    parseValue: ParseFunction,
): [ReturnType<ParseFunction>, (value: string) => void] {
    const history = useHistory();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const strValue = queryParams.get(name);
    const value = parseValue(strValue !== null ? strValue : undefined);
    const setValue = React.useCallback(
        (newValue: string) => {
            const newQueryParams = new URLSearchParams(location.search);
            newQueryParams.set(name, newValue);
            history.replace({ search: newQueryParams.toString() });
        },
        [location.search, history, name],
    );
    return [value, setValue];
}
function SitePreview({ resolvePath, logo = <CometColor sx={{ fontSize: 32 }} /> }: Props): React.ReactElement {
    const [previewPath, setPreviewPath] = useSearchState("path", (v) => v ?? "");

    const [device, setDevice] = useSearchState("device", (v) => {
        if (![Device.Responsive, Device.Mobile, Device.Tablet, Device.Desktop].includes(Number(v))) {
            return Device.Responsive;
        }
        return Number(v) as Device;
    });
    const [showOnlyVisible, setShowOnlyVisible] = useSearchState("showOnlyVisible", (v) => !v || v === "true");

    const [linkToOpen, setLinkToOpen] = React.useState<ExternalLinkBlockData | undefined>(undefined);
    const sitePreviewParams: SitePreviewParams = { includeInvisibleBlocks: !showOnlyVisible };
    const formattedSitePreviewParams = JSON.stringify(sitePreviewParams);

    const { scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });

    const [initialPageUrl, setInitialPageUrl] = React.useState(buildPreviewUrl(siteConfig.previewUrl, previewPath, formattedSitePreviewParams));

    // update the initialPreviewUrl when previewParams changes
    // the iframe is then force-rerendered with the new previewUrl
    React.useEffect(() => {
        // react-hooks/exhaustive-deps is disabled because the src-prop of iframe is uncontrolled
        // the src-value is just the default value, the iframe keeps its own src-state (by clicking links inside the iframe)
        setInitialPageUrl(buildPreviewUrl(siteConfig.previewUrl, previewPath, formattedSitePreviewParams));
    }, [formattedSitePreviewParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const intl = useIntl();

    // the site in the iframe notifies us about it's current location
    // we sync the location back to our admin-url, so we have it and can reload the page without loosing
    const handlePreviewLocationChange = React.useCallback(
        (message: SitePrevewIFrameLocationMessage) => {
            const pathPrefix = new URL(siteConfig.previewUrl).pathname;
            if (message.data.pathname.search(pathPrefix) === 0) {
                // this is the original-pathname of the site, we extract it and keep it in "our" url as get-param
                let normalizedPathname = message.data.pathname.substr(pathPrefix.length);
                if (normalizedPathname == "") normalizedPathname = "/";
                if (previewPath !== normalizedPathname) {
                    setPreviewPath(normalizedPathname);
                }
            }
        },
        [previewPath, setPreviewPath, siteConfig.previewUrl],
    );

    const handleDeviceChange = (newDevice: Device) => {
        setDevice(String(newDevice));
    };

    const handleShowOnlyVisibleChange = () => {
        const newShowOnlyVisible = !showOnlyVisible;
        setShowOnlyVisible(String(newShowOnlyVisible));
    };

    const siteLink = `${siteConfig.url}${resolvePath ? resolvePath(previewPath, scope) : previewPath}`;

    useSitePreviewIFrameBridge((message) => {
        switch (message.cometType) {
            case SitePreviewIFrameMessageType.OpenLink:
                setLinkToOpen(message.data.link);
                break;
            case SitePreviewIFrameMessageType.SitePreviewLocation:
                handlePreviewLocationChange(message);
                break;
        }
    });

    return (
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
                                        <DomainLocked />
                                    </Tooltip>
                                ) : (
                                    <Domain />
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
    );
}

export { SitePreview };
