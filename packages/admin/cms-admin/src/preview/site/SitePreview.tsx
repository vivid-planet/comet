import { gql, useQuery } from "@apollo/client";
import { CometColor } from "@comet/admin-icons";
import { Public, VpnLock } from "@mui/icons-material";
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
import { SitePrevewIFrameLocationMessage, SitePreviewIFrameMessageType } from "./iframebridge/SitePreviewIFrameMessage";
import { useSitePreviewIFrameBridge } from "./iframebridge/useSitePreviewIFrameBridge";
import { OpenLinkDialog } from "./OpenLinkDialog";
import { GQLHmacCreateQuery } from "./SitePreview.generated";
import { ActionsContainer, LogoWrapper, Root, SiteInformation, SiteLink, SiteLinkWrapper } from "./SitePreview.sc";

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

    const { scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });

    const [initialPath, setInitialPath] = React.useState(previewPath); // prevents the iframe from reloading on every change

    const intl = useIntl();

    // the site in the iframe notifies us about it's current location
    // we sync the location back to our admin-url, so we have it and can reload the page without loosing
    const handlePreviewLocationChange = React.useCallback(
        (message: SitePrevewIFrameLocationMessage) => {
            if (previewPath !== message.data.pathname) {
                setPreviewPath(message.data.pathname);
            }
        },
        [previewPath, setPreviewPath],
    );

    const handleDeviceChange = (newDevice: Device) => {
        setDevice(String(newDevice));
    };

    const handleShowOnlyVisibleChange = () => {
        const newShowOnlyVisible = !showOnlyVisible;
        setShowOnlyVisible(String(newShowOnlyVisible));
        setInitialPath(previewPath);
        refetch();
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

    const { data, error, refetch } = useQuery<GQLHmacCreateQuery>(
        gql`
            query HmacCreate {
                hmacCreate {
                    timestamp
                    hash
                }
            }
        `,
        {
            fetchPolicy: "network-only",
        },
    );
    if (error) throw new Error(error.message);
    if (!data) return <></>;
    const params = new URLSearchParams({
        timestamp: data.hmacCreate.timestamp.toString(),
        hash: data.hmacCreate.hash,
        path: initialPath,
        includeInvisibleBlocks: showOnlyVisible ? "false" : "true",
    });
    const initialPageUrl = `${siteConfig.url}/api/preview?${params.toString()}`;

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
    );
}

export { SitePreview };
