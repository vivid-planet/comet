import { Divider, ListItemText, ListSubheader, MenuItem, Select as MuiSelect, Typography } from "@material-ui/core";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";
import styled from "styled-components";

import { ColumnsBlockLayout } from "../createColumnsBlock";

interface Section {
    name?: string;
    label?: React.ReactNode;
    layouts: ColumnsBlockLayout[];
}

interface Props extends FieldRenderProps<ColumnsBlockLayout> {
    layouts: ColumnsBlockLayout[];
}

export function FinalFormLayoutSelect({ input: { value, onChange }, layouts }: Props): React.ReactElement {
    const sections = React.useMemo(() => {
        const sections: Section[] = [];

        layouts.forEach((layout) => {
            const sectionForLayout = sections.find((section) =>
                typeof layout.section === "string" ? section.name === layout.section : section.name === layout.section?.name,
            );
            if (sectionForLayout) {
                sectionForLayout.layouts.push(layout);
            } else {
                const name = typeof layout.section === "string" ? layout.section : layout.section?.name;
                sections.push({
                    name,
                    label: typeof layout.section === "object" && layout.section?.label ? layout.section.label : name,
                    layouts: [layout],
                });
            }
        });
        // Move section with name "undefined" to last
        return sections.sort((sectionA, sectionB) => (sectionA.name === undefined ? 1 : sectionB.name === undefined ? -1 : 0));
    }, [layouts]);

    const hasMultipleSections = sections.length > 1;

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        if (event.target.value === undefined) {
            // Ignore clicks on list subheader
            return;
        }

        onChange(layouts.find((layout) => layout.name === event.target.value));
    };

    return (
        <Select value={value.name} onChange={handleChange} fullWidth>
            {sections.map((section, i) => [
                hasMultipleSections ? (
                    <ListSubheader key={`section-${section.name}`}>
                        {i > 0 ? <Divider /> : null}
                        <Typography variant="h6" color="textPrimary">
                            {section.label}
                        </Typography>
                    </ListSubheader>
                ) : null,
                ...section.layouts.map((layout) => (
                    <MenuItem key={layout.name} value={layout.name}>
                        <MenuItemContent>
                            {layout.preview}
                            <ListItemText primary={layout.label} secondary={layout.name} />
                        </MenuItemContent>
                    </MenuItem>
                )),
            ])}
        </Select>
    );
}

const MenuItemContent = styled.div`
    display: grid;
    grid-template-columns: minmax(80px, 1fr) 2fr;
    column-gap: 20px;
    align-items: center;
`;

const Select = styled(MuiSelect)`
    && {
        height: 64px;
    }

    &.MuiInput-underline::before,
    &.MuiInput-underline::after {
        display: none;
    }
`;
