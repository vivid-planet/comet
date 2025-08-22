// Same file in admin and site

// Messages sent from iFrame -> Admin
import { type ExternalLinkBlockData } from "../blocks.generated";

export enum IFrameMessageType {
    Ready = "Ready",
    SelectComponent = "SelectComponent",
    HoverComponent = "HoverComponent",
    /**
     * @deprecated Use SitePreviewIFrameMessageType.OpenLink instead
     */
    OpenLink = "OpenLink",
    /**
     * @deprecated Use SitePreviewIFrameMessageType.SitePreviewLocation instead
     */
    SitePreviewLocation = "SitePreviewLocation",
}

/**
 * The `IReadyIFrameMessage` message is sent from the site to the admin when the iFrame is ready to receive messages.
 */
export interface IReadyIFrameMessage {
    cometType: IFrameMessageType.Ready;
}

/**
 * The `IFrameSelectComponentMessage` is sent from the site to the admin when a component is selected in the iFrame.
 *
 * The admin interface will then try to navigate to the corresponding block's admin interface.
 */
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

/**
 * The `IFrameHoverComponentMessage` is sent from the site to the admin, when a component is hovered in the iFrame and should be highlighted in the admin interface.
 */
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
    GraphQLApiUrl = "GraphQLApiUrl",
}

/**
 * The `IAdminBlockMessage` is sent from the admin to the site, whih block should be displayed in the iFrame.
 */
interface IAdminBlockMessage {
    cometType: AdminMessageType.Block;
    data: {
        block: unknown;
    };
}

/**
 * The `IAdminShowOnlyVisibleMessage` is sent from the admin to the site, when the "Show only visible" checkbox is toggled.
 */
export interface IAdminShowOnlyVisibleMessage {
    cometType: AdminMessageType.ShowOnlyVisible;
    data: {
        showOnlyVisible: boolean;
    };
}

/**
 * The `IAdminSelectComponentMessage` is sent from the admin to the site, when a component is selected in the admin interface.
 */
interface IAdminSelectComponentMessage {
    cometType: AdminMessageType.SelectComponent;
    data: {
        adminRoute: string;
    };
}

/**
 * The `IAdminHoverComponentMessage` is sent from the admin to the site, when a component is hovered in the admin interface.
 */
export interface IAdminHoverComponentMessage {
    cometType: AdminMessageType.HoverComponent;
    data: {
        adminRoute: string | null;
    };
}

/**
 * The `IAdminContentScopeMessage` is sent from the admin to the site, when the content scope is changed in the admin interface.
 */
export interface IAdminContentScopeMessage {
    cometType: AdminMessageType.ContentScope;
    data: {
        contentScopeJwt: string;
    };
}

/**
 * The `IAdminGraphQLApiUrlMessage` is sent from the admin to the site.
 */
export interface IAdminGraphQLApiUrlMessage {
    cometType: AdminMessageType.GraphQLApiUrl;
    data: {
        graphQLApiUrl: string;
    };
}

export type AdminMessage =
    | IAdminBlockMessage
    | IAdminSelectComponentMessage
    | IAdminHoverComponentMessage
    | IAdminContentScopeMessage
    | IAdminShowOnlyVisibleMessage
    | IAdminGraphQLApiUrlMessage;
