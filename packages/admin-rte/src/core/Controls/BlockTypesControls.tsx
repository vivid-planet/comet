import { FormControl, MenuItem, Select } from "@mui/material";
import { Theme } from "@mui/material/styles";
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
                // TODO: Fix this
                // @ts-ignore
                classes={{ root: classes.select }}
                disabled={disabled}
                value={activeDropdownBlockType}
                displayEmpty
                disableUnderline
                // TODO: Fix this
                // @ts-ignore
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
    // TODO: Fix this
    // @ts-ignore
    const rteTheme = getRteTheme(theme.props?.CometAdminRte);

    return createStyles<RteBlockTypeControlsClassKey, Props>({
        root: {
            "& [class*='MuiInputBase-root']": {
                backgroundColor: "transparent",
                height: "auto",
                border: "none",
            },
            "& [class*='MuiSelect-icon']": {
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

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminRteBlockTypeControls: RteBlockTypeControlsClassKey;
    }
}
