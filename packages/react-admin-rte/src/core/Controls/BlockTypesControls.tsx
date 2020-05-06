import { MenuItem, Select } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { IControlProps } from "../types";
import useBlockTypes from "./useBlockTypes";

const useStylesForSelect = makeStyles({
    select: {
        padding: 0,
        minWidth: "180px",
        lineHeight: "24px",
        fontSize: "14px",
    },
});

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
    const classesForSelect = useStylesForSelect();

    if (!dropdownFeatures.length) {
        return null;
    }

    return (
        <FormControl>
            <Select classes={classesForSelect} value={activeDropdownBlockType} displayEmpty disableUnderline onChange={handleBlockTypeChange}>
                <MenuItem value="unstyled" dense>
                    Standard
                </MenuItem>
                {dropdownFeatures.map(c => (
                    <MenuItem key={c.name} value={c.name} dense>
                        {c.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
