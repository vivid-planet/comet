import { Stack } from "@comet/admin";
import { DensityComfortable, DensityCompact, DensityStandard } from "@comet/admin-icons";
import { createCompositeBlock, createCompositeBlockSelectField } from "@comet/blocks-admin";
import { ListItemIcon } from "@mui/material";
import { useState } from "react";

import { storyRouterDecorator } from "../../story-router.decorator";

export default {
    title: "@comet/cms-admin/createCompositeBlock/createCompositeBlockSelectField",
    decorators: [storyRouterDecorator()],
};

export const Basic = () => {
    const CompositeBlock = createCompositeBlock({
        name: "Composite",
        displayName: "Composite",
        blocks: {
            variant: {
                title: "Variant",
                block: createCompositeBlockSelectField({
                    defaultValue: "primary",
                    options: [
                        { value: "primary", label: "Primary" },
                        { value: "secondary", label: "Secondary" },
                        { value: "tertiary", label: "Tertiary" },
                    ],
                    fullWidth: true,
                }),
            },
        },
    });

    const [state, setState] = useState(CompositeBlock.defaultValues());

    return (
        <Stack topLevelTitle={null}>
            <CompositeBlock.AdminComponent state={state} updateState={setState} />
        </Stack>
    );
};

export const WithIcon = () => {
    const CompositeBlock = createCompositeBlock({
        name: "Composite",
        displayName: "Composite",
        blocks: {
            density: {
                title: "Density",
                block: createCompositeBlockSelectField({
                    defaultValue: "compact",
                    options: [
                        {
                            value: "compact",
                            label: (
                                <>
                                    <ListItemIcon>
                                        <DensityCompact />
                                    </ListItemIcon>
                                    Compact
                                </>
                            ),
                        },
                        {
                            value: "standard",
                            label: (
                                <>
                                    <ListItemIcon>
                                        <DensityStandard />
                                    </ListItemIcon>
                                    Standard
                                </>
                            ),
                        },
                        {
                            value: "comfortable",
                            label: (
                                <>
                                    <ListItemIcon>
                                        <DensityComfortable />
                                    </ListItemIcon>
                                    Comfortable
                                </>
                            ),
                        },
                    ],
                    fullWidth: true,
                }),
            },
        },
    });

    const [state, setState] = useState(CompositeBlock.defaultValues());

    return (
        <Stack topLevelTitle={null}>
            <CompositeBlock.AdminComponent state={state} updateState={setState} />
        </Stack>
    );
};
