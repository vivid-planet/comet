import { AppHeaderDropdown } from "@comet/admin";
import { List, ListItem, ListItemIcon as MuiListItemIcon, ListItemText, SvgIconProps } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

export interface ContentScopeSelectProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: { value: any; label?: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Array<{ value: any; label?: string }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (newValue: any) => void;
    defaultLabel?: string;
    icon?: (p: SvgIconProps) => JSX.Element;
    disabled?: boolean;
}

export default function ContentScopeSelect({ value, onChange, values, defaultLabel = "", icon, disabled }: ContentScopeSelectProps): JSX.Element {
    const Icon = icon || null;
    // @TODO: styling for disabled-state
    return (
        <AppHeaderDropdown buttonChildren={value ? value.label || value.value.toUpperCase() : defaultLabel} startIcon={Icon ? <Icon /> : undefined}>
            {(hideDropdown) => (
                <List>
                    {values.map(({ value: v, label: l }) => (
                        <ListItem
                            key={v}
                            disabled={disabled}
                            selected={value.value === v}
                            button
                            onClick={() => {
                                hideDropdown();
                                onChange(v);
                            }}
                        >
                            {Icon ? (
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                            ) : null}
                            <ListItemText primary={l || v.toUpperCase()} />
                        </ListItem>
                    ))}
                </List>
            )}
        </AppHeaderDropdown>
    );
}

const ListItemIcon = styled(MuiListItemIcon)`
    min-width: 25px;
`;
