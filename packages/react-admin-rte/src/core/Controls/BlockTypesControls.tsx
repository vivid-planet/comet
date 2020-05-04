import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";
import { IControlProps } from "../types";
import useBlockTypes from "./useBlockTypes";

const useStylesForSelect = makeStyles({
    select: {
        minWidth: 200, // @TODO: adapt this value when component is styled
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
            <Select classes={classesForSelect} value={activeDropdownBlockType} displayEmpty onChange={handleBlockTypeChange}>
                <MenuItem value="unstyled">
                    <>Standard</>
                </MenuItem>
                {dropdownFeatures.map(c => (
                    <MenuItem key={c.name} value={c.name}>
                        {c.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
