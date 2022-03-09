import { useStoredState } from "@comet/admin";
import { IFrameBridgeProvider, IFrameLocationMessage, IFrameMessageType } from "@comet/admin-blocks";
import { CometColor } from "@comet/admin-icons";
import { Grid, Tooltip, Typography } from "@material-ui/core";
import { Public, VpnLock } from "@material-ui/icons";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { RouteComponentProps, useHistory } from "react-router";

import { ExternalLinkBlockData } from "../blocks.generated";
import { ContentScopeInterface, useContentScope } from "../contentScope/Provider";
import { useSiteConfig } from "../sitesConfig/useSiteConfig";
import { DeviceToggle } from "./DeviceToggle";
import { IFrameViewer } from "./IFrameViewer";
import { OnlyShowVisibleContentModal } from "./OnlyShowVisilbeContentModal";
import { OpenLinkDialog } from "./OpenLinkDialog";
import { ActionsContainer, CometLogoWrapper, CometSiteLink, CometSiteLinkWrapper, Root, useStyles } from "./SitePreview.sc";
import { Device } from "./types";
import { VisibilityToggle } from "./VisibilityToggle";

interface SiteState {
    includeInvisibleContent: boolean;
}

function buildPreviewUrl(previewUrl: string, previewPath: string, formattedSiteState: string) {
    const GET_PARAM = "__preview";
    return `${previewUrl}${previewPath}?${GET_PARAM}=${formattedSiteState}`;
}

interface Props extends RouteComponentProps {
    resolvePath?: (path: string, scope: ContentScopeInterface) => string;
}

function SitePreview({ location, resolvePath }: Props): React.ReactElement {
    const queryParams = new URLSearchParams(location.search);

    const [previewPath, setPreviewPath] = React.useState<string>(queryParams.get("path") || "");

    const [device, setDevice] = useStoredState<Device>("sitePreviewDevice", Device.Responsive);
    const [showOnlyVisible, setShowOnlyVisible] = useStoredState<boolean>("sitePreviewShowOnlyVisible", false);
    const [hasSeenShowOnlyVisibleHint, setHasSeenShowOnlyVisibleHint] = useStoredState<boolean>("hasSeenShowOnlyVisibleHint", false);

    const [linkToOpen, setLinkToOpen] = React.useState<ExternalLinkBlockData | undefined>(undefined);
    const showOnlyVisibleHint = !hasSeenShowOnlyVisibleHint && showOnlyVisible;
    const siteState: SiteState = { includeInvisibleContent: !showOnlyVisible };
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

    const classes = useStyles();

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
                    const search = new URLSearchParams({ path: normalizedPathname });
                    history.push({ search: search.toString() });
                }
            }
        },
        [previewPath, history],
    );

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
                            <CometLogoWrapper>
                                <CometColor className={classes.cometIcon} />
                                <Typography>
                                    <FormattedMessage defaultMessage="Preview" id="comet.sitePreview.preview" />
                                </Typography>
                                <CometSiteLinkWrapper>
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
                                    <CometSiteLink variant="body1" href={siteLink} target="_blank">
                                        {siteLink}
                                    </CometSiteLink>
                                </CometSiteLinkWrapper>
                            </CometLogoWrapper>
                        </Grid>
                        <Grid item>
                            <DeviceToggle device={device} onChange={setDevice} />
                        </Grid>
                        <Grid item>
                            <VisibilityToggle showOnlyVisible={showOnlyVisible} onChange={setShowOnlyVisible} />
                        </Grid>
                    </Grid>
                </ActionsContainer>
                <OnlyShowVisibleContentModal
                    open={showOnlyVisibleHint}
                    onClose={() => {
                        setHasSeenShowOnlyVisibleHint(true);
                    }}
                />
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
