import {
    Divider,
    ListItemText as MuiListItemText,
    ListSubheader as MuiListSubheader,
    MenuItem as MuiMenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { FieldRenderProps } from "react-final-form";

import { ColumnsBlockLayout } from "../createColumnsBlock";

interface Section {
    name?: string;
    label?: React.ReactNode;
    layouts: ColumnsBlockLayout[];
}

interface Props extends FieldRenderProps<ColumnsBlockLayout> {
    layouts: ColumnsBlockLayout[];
    numberOfMatchingColumns: number;
}

export function FinalFormLayoutSelect({ input: { value, onChange }, layouts, numberOfMatchingColumns }: Props) {
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

    const handleChange = (event: SelectChangeEvent<unknown>) => {
        if (event.target.value === undefined) {
            // Ignore clicks on list subheader
            return;
        }

        onChange(layouts.find((layout) => layout.name === event.target.value));
    };

    if (numberOfMatchingColumns === 0) {
        return null;
    }

    if (numberOfMatchingColumns === 1 && layouts.length >= 1) {
        return (
            <LayoutDisplayContainer>
                {layouts[0].preview}
                <ListItemText primary={layouts[0].label} secondary={layouts[0].name} />
            </LayoutDisplayContainer>
        );
    }

    return (
        <Select value={value.name} onChange={handleChange} fullWidth>
            {sections.map((section, i) => [
                hasMultipleSections ? (
                    <>
                        {i > 0 ? <SectionDivider /> : null}
                        <ListSubheader key={`section-${section.name}`}>
                            <Typography variant="body2" fontWeight="bold" color="text.primary">
                                {section.label}
                            </Typography>
                        </ListSubheader>
                    </>
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

const ListSubheader = styled(MuiListSubheader)`
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
`;

const SectionDivider = styled(Divider)`
    && {
        margin-top: ${({ theme }) => theme.spacing(2)};
        margin-bottom: ${({ theme }) => theme.spacing(2)};
    }
`;

const MenuItem = styled(MuiMenuItem)`
    padding-top: ${({ theme }) => theme.spacing(2)};
    padding-bottom: ${({ theme }) => theme.spacing(2)};
    margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const MenuItemContent = styled("div")`
    display: grid;
    grid-template-columns: minmax(80px, 1fr) 2fr;
    column-gap: ${({ theme }) => theme.spacing(2)};
    align-items: center;
`;

const ListItemText = styled(MuiListItemText)`
    margin-top: 0;
    margin-bottom: 0;
`;

const LayoutDisplayContainer = styled("div")`
    display: grid;
    grid-template-columns: minmax(80px, 1fr) 2fr;
    column-gap: ${({ theme }) => theme.spacing(2)};
    align-items: center;
    background-color: #ffffff;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    padding: 9px;
    box-sizing: border-box;
`;
