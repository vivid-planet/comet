// Same file in admin and site

// Messages sent from iFrame -> Admin
import { ExternalLinkBlockData } from "../blocks.generated";

export enum IFrameMessageType {
    Ready = "Ready",
    SelectComponent = "SelectComponent",
    HoverComponent = "HoverComponent",
    ContentScope = "ContentScope",
    /**
     * @deprecated Use SitePreviewIFrameMessageType.OpenLink instead
     */
    OpenLink = "OpenLink",
    /**
     * @deprecated Use SitePreviewIFrameMessageType.SitePreviewLocation instead
     */
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

/**
 * @deprecated Use SitePreviewIFrameOpenLinkMessage instead
 */
export interface IFrameOpenLinkMessage {
    cometType: IFrameMessageType.OpenLink;
    data: {
        link: ExternalLinkBlockData;
    };
}

/**
 * @deprecated Use SitePreviewIFrameLocationMessage instead
 */
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
    ShowOnlyVisible = "ShowOnlyVisible",
    SelectComponent = "SelectComponent",
    HoverComponent = "HoverComponent",
    ContentScope = "ContentScope",
}
export interface IAdminBlockMessage {
    cometType: AdminMessageType.Block;
    data: {
        block: unknown;
    };
}

export interface IAdminShowOnlyVisibleMessage {
    cometType: AdminMessageType.ShowOnlyVisible;
    data: {
        showOnlyVisible: boolean;
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
        adminRoute: string;
    };
}

export interface IAdminContentScopeMessage {
    cometType: AdminMessageType.ContentScope;
    data: {
        contentScope: unknown;
    };
}

export type AdminMessage =
    | IAdminBlockMessage
    | IAdminSelectComponentMessage
    | IAdminHoverComponentMessage
    | IAdminContentScopeMessage
    | IAdminShowOnlyVisibleMessage;
