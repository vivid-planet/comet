// Same file in admin and site

// Messages sent from iFrame -> Admin
import { ExternalLinkBlockData } from "../../blocks.generated";

export enum SitePreviewIFrameMessageType {
    Ready = "Ready",
    OpenLink = "OpenLink",
    SitePreviewLocation = "SitePreviewLocation",
}

export interface SitePreviewReadyIFrameMessage {
    cometType: SitePreviewIFrameMessageType.Ready;
}

export interface SitePreviewIFrameOpenLinkMessage {
    cometType: SitePreviewIFrameMessageType.OpenLink;
    data: {
        link: ExternalLinkBlockData;
    };
}

export interface SitePreviewIFrameLocationMessage {
    cometType: SitePreviewIFrameMessageType.SitePreviewLocation;
    data: Pick<Location, "search" | "pathname">;
}

export type SitePreviewIFrameMessage = SitePreviewReadyIFrameMessage | SitePreviewIFrameOpenLinkMessage | SitePreviewIFrameLocationMessage;
