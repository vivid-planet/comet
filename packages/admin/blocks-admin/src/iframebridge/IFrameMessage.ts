// Same file in admin and site

// Messages sent from iFrame -> Admin

export enum IFrameMessageType {
    Ready = "Ready",
    SelectComponent = "SelectComponent",
    HoverComponent = "HoverComponent",
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

export interface IFrameHoverComponentMessage {
    cometType: IFrameMessageType.HoverComponent;
    data: {
        route: string | null;
    };
}

export type IFrameMessage = IReadyIFrameMessage | IFrameSelectComponentMessage | IFrameHoverComponentMessage;

// Messages sent from Admin -> iFrame
export enum AdminMessageType {
    Block = "Block",
    SelectComponent = "SelectComponent",
    HoverComponent = "HoverComponent",
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

export type AdminMessage = IAdminBlockMessage | IAdminSelectComponentMessage | IAdminHoverComponentMessage;
