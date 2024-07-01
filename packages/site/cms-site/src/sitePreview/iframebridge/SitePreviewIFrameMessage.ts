// Same file in admin and site

// Messages sent from iFrame -> Admin
import { ExternalLinkBlockData } from "../../blocks.generated";

/* eslint-disable @typescript-eslint/naming-convention */
// TODO: Replace with camelCase
export enum SitePreviewIFrameMessageType {
    OpenLink = "OpenLink",
    SitePreviewLocation = "SitePreviewLocation",
}
/* eslint-enable @typescript-eslint/naming-convention */

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
