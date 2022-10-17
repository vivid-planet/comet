import { ComponentsOverrides, FormControl, inputBaseClasses, MenuItem, Select, selectClasses, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { IControlProps } from "../types";
import getRteTheme from "../utils/getRteTheme";
import useBlockTypes, { BlockTypesApi } from "./useBlockTypes";

interface Props extends IControlProps {
    blockTypes: BlockTypesApi;
}

function BlockTypesControls({ disabled, blockTypes, classes }: Props & WithStyles<typeof styles>) {
    const { dropdownFeatures, activeDropdownBlockType, handleBlockTypeChange } = blockTypes;

    const blockTypesListItems: Array<{ name: string; label: React.ReactNode }> = dropdownFeatures.map((c) => ({ name: c.name, label: c.label }));

    return (
        <FormControl classes={{ root: classes.root }}>
            <Select
                classes={{ select: classes.select }}
                disabled={disabled}
                value={activeDropdownBlockType}
                displayEmpty
                variant="filled"
                MenuProps={{ elevation: 1 }}
                onChange={handleBlockTypeChange}
            >
                {blockTypesListItems.map((c) => (
                    <MenuItem key={c.name} value={c.name} dense>
                        {c.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export type RteBlockTypeControlsClassKey = "root" | "select";

const styles = (theme: Theme) => {
    const rteTheme = getRteTheme(theme.components?.CometAdminRte?.defaultProps);

    return createStyles<RteBlockTypeControlsClassKey, Props>({
        root: {
            [`& .${inputBaseClasses.root}`]: {
                backgroundColor: "transparent",
                height: "auto",
                border: "none",
                "&, &:hover": {
                    "&:before, &:after": {
                        borderBottomWidth: 0,
                    },
                },
            },
            [`& .${selectClasses.icon}`]: {
                top: "auto",
                color: "inherit",
            },
        },
        select: {
            color: rteTheme.colors.buttonIcon,
            minWidth: 180,
            lineHeight: "24px",
            fontSize: 14,
            padding: 0,

            [`&.${selectClasses.select}`]: {
                minHeight: 0,
            },
        },
    });
};

const StyledBlockTypesControls = withStyles(styles, { name: "CometAdminRteBlockTypeControls" })(BlockTypesControls);

// If there are no dropdown-features, this must return null not just an empty component, to prevent an empty item from being rendered in Toolbar
export default (p: IControlProps) => {
    const { editorState, setEditorState, editorRef, options } = p;
    const { supports: supportedThings, blocktypeMap, standardBlockType } = options;
    const blockTypes = useBlockTypes({ editorState, setEditorState, supportedThings, blocktypeMap, editorRef, standardBlockType });

    if (!blockTypes.dropdownFeatures.length) {
        return null;
    }

    return <StyledBlockTypesControls {...p} blockTypes={blockTypes} />;
};

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminRteBlockTypeControls: RteBlockTypeControlsClassKey;
    }

    interface Components {
        CometAdminRteBlockTypeControls?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminRteBlockTypeControls"];
        };
    }
}
