import * as React from "react";
import { FormattedMessage } from "react-intl";

import { BlockCategory, BlockInterface, RootBlockInterface } from "../types";

type DefaultBlockSkeleton<InputApi, State, OutputApi> = Omit<BlockInterface<InputApi, State, OutputApi>, "name" | "defaultValues">;
type RootBlockSkeleton<InputApi, State, OutputApi> = Omit<RootBlockInterface<InputApi, State, OutputApi>, "name" | "defaultValues">;

/* eslint-disable @typescript-eslint/no-explicit-any */
export function createBlockSkeleton(type: "root-block"): RootBlockSkeleton<any, any, any>;
export function createBlockSkeleton(type: "block"): DefaultBlockSkeleton<any, any, any>;
export function createBlockSkeleton(): DefaultBlockSkeleton<any, any, any>;
export function createBlockSkeleton(type: "block" | "root-block" = "block"): RootBlockSkeleton<any, any, any> | DefaultBlockSkeleton<any, any, any> {
    if (type === "root-block") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return createRootBlockSkeleton<any, any, any>();
    } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return createDefaultBlockSkeleton<any, any, any>();
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function common<InputApi, State, OutputApi>(): Omit<
    BlockInterface<InputApi, State, OutputApi>,
    "name" | "defaultValues" | "AdminComponent" | "Preview"
> {
    return {
        displayName: "No display name",
        category: BlockCategory.Other,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        input2State: (v: any) => v,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-explicit-any
        state2Output: ({ __typename, ...rest }: any) => {
            return rest; // omit __typename for now @TODO: use __typename instead of BlockType
        },
        output2State: async (output) => output as unknown as State,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createPreviewState: (v: any, previewContext) => {
            return { ...v, adminMeta: { route: previewContext.parentUrl } };
        },
        isValid: () => true,
        previewContent: () => [],
        resolveDependencyRoute: () => "",
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createDefaultBlockSkeleton<InputApi, State, OutputApi>(): DefaultBlockSkeleton<InputApi, State, OutputApi> {
    return {
        ...common<InputApi, State, OutputApi>(),
        AdminComponent: () => {
            return <FormattedMessage id="comet.blocks.skeleton.noAdminImplemented" defaultMessage="This block has no configurable content" />;
        },
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createRootBlockSkeleton<InputApi, State, OutputApi>(): RootBlockSkeleton<InputApi, State, OutputApi> {
    return {
        ...common<InputApi, State, OutputApi>(),
        adminComponentParts: () => [
            {
                key: "",
                label: "Label",
                content: <FormattedMessage id="comet.blocks.skeleton.noAdminImplemented" defaultMessage="This block has no configurable content" />,
            },
        ], // empty implementation
    };
}
