// Same file in admin and site

// Messages sent from iFrame -> Admin
import { type ExternalLinkBlockData } from "../../blocks.generated";

export enum SitePreviewIFrameMessageType {
    OpenLink = "OpenLink",
    SitePreviewLocation = "SitePreviewLocation",
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

export type SitePreviewIFrameMessage = SitePreviewIFrameOpenLinkMessage | SitePreviewIFrameLocationMessage;
