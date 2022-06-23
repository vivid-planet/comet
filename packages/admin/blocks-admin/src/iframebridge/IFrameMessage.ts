// Same file in admin and site

// Messages sent from iFrame -> Admin
import { ExternalLinkBlockData } from "../blocks.generated";

export enum IFrameMessageType {
    Ready = "Ready",
    SelectComponent = "SelectComponent",
    HoverComponent = "HoverComponent",
    OpenLink = "OpenLink",
    SitePreviewLocation = "SitePreviewLocation",
}

export interface IReadyIFrameMessage {
    cometType: IFrameMessageType.Ready;
}

export interface IFrameSelectComponentMessage {
    cometType: IFrameMessageType.SelectComponent;
    data: {
        adminRoute: string;
    };
}

export interface IFrameOpenLinkMessage {
    cometType: IFrameMessageType.OpenLink;
    data: {
        link: ExternalLinkBlockData;
    };
}

export interface IFrameLocationMessage {
    cometType: IFrameMessageType.SitePreviewLocation;
    data: Pick<Location, "search" | "pathname">;
}

export interface IFrameHoverComponentMessage {
    cometType: IFrameMessageType.HoverComponent;
    data: {
        route: string | null;
    };
}

export type IFrameMessage =
    | IReadyIFrameMessage
    | IFrameSelectComponentMessage
    | IFrameOpenLinkMessage
    | IFrameLocationMessage
    | IFrameHoverComponentMessage;

// Messages sent from Admin -> iFrame
export enum AdminMessageType {
    Block = "Block",
    SelectComponent = "SelectComponent",
    HoverComponent = "HoverComponent",
    AccessToken = "AccessToken",
}
export interface IAdminBlockMessage {
    cometType: AdminMessageType.Block;
    data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        block: any;
    };
}

export interface IAdminSelectComponentMessage {
    cometType: AdminMessageType.SelectComponent;
    data: {
        adminRoute: string;
    };
}

export interface IAdminHoverComponentMessage {
    cometType: AdminMessageType.HoverComponent;
    data: {
        adminRoute: string | null;
    };
}

export interface IAdminAccessTokenMessage {
    cometType: AdminMessageType.AccessToken;
    accessToken: string;
}

export type AdminMessage = IAdminBlockMessage | IAdminSelectComponentMessage | IAdminHoverComponentMessage | IAdminAccessTokenMessage;
