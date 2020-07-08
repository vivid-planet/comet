import { MenuItem } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import * as React from "react";
import { IControlProps } from "../types";
import * as sc from "./BlockTypesControls.sc";
import useBlockTypes from "./useBlockTypes";

export default function BlockTypesControls({
    editorState,
    setEditorState,
    editorRef,
    options: { supports: supportedThings, customBlockMap: customBlockTypeMap },
}: IControlProps) {
    const { dropdownFeatures, activeDropdownBlockType, handleBlockTypeChange } = useBlockTypes({
        editorState,
        setEditorState,
        supportedThings,
        customBlockTypeMap,
        editorRef,
    });

    if (!dropdownFeatures.length) {
        return null;
    }

    return (
        <FormControl>
            <sc.Select value={activeDropdownBlockType} displayEmpty disableUnderline onChange={handleBlockTypeChange}>
                <MenuItem value="unstyled" dense>
                    Standard
                </MenuItem>
                {dropdownFeatures.map(c => (
                    <MenuItem key={c.name} value={c.name} dense>
                        {c.label}
                    </MenuItem>
                ))}
            </sc.Select>
        </FormControl>
    );
}
