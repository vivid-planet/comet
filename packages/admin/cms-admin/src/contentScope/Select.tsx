import { AppHeaderDropdown, ClearInputAdornment } from "@comet/admin";
import { Search } from "@comet/admin-icons";
import { InputAdornment, InputBase, List, ListItemButton, ListItemIcon as MuiListItemIcon, ListItemText, SvgIconProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useIntl } from "react-intl";

export interface ContentScopeSelectProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: { value: any; label?: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: Array<{ value: any; label?: string }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange: (newValue: any) => void;
    defaultLabel?: string;
    icon?:
        | React.ComponentType<SvgIconProps>
        | React.ForwardRefExoticComponent<React.PropsWithoutRef<SvgIconProps> & React.RefAttributes<SVGSVGElement>>;
    disabled?: boolean;
    searchable?: boolean;
}

export default function ContentScopeSelect({
    value,
    onChange,
    values,
    defaultLabel = "",
    icon,
    disabled,
    searchable = false,
}: ContentScopeSelectProps): JSX.Element {
    const intl = useIntl();

    const Icon = icon || null;
    // @TODO: styling for disabled-state

    const [searchValue, setSearchValue] = React.useState<string>("");

    const filteredValues = searchable
        ? values.filter(
              (item) => item.value.toLowerCase().includes(searchValue.toLowerCase()) || item.label?.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : values;

    return (
        <AppHeaderDropdown buttonChildren={value ? value.label || value.value.toUpperCase() : defaultLabel} startIcon={Icon ? <Icon /> : undefined}>
            {(hideDropdown) => (
                <List>
                    {searchable && (
                        <InputBase
                            sx={{ m: 1 }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            }
                            placeholder={intl.formatMessage({
                                id: "contentScope.select.searchInput.placeholder",
                                defaultMessage: "Search ...",
                            })}
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.currentTarget.value)}
                            endAdornment={
                                <ClearInputAdornment onClick={() => setSearchValue("")} hasClearableContent={searchValue !== ""} position="end" />
                            }
                            autoFocus
                        />
                    )}
                    {filteredValues.map(({ value: v, label: l }) => (
                        <ListItemButton
                            key={v}
                            disabled={disabled}
                            selected={value.value === v}
                            onClick={() => {
                                hideDropdown();
                                onChange(v);
                                setSearchValue("");
                            }}
                        >
                            {Icon ? (
                                <ListItemIcon>
                                    <Icon />
                                </ListItemIcon>
                            ) : null}
                            <ListItemText primary={l || v.toUpperCase()} />
                        </ListItemButton>
                    ))}
                </List>
            )}
        </AppHeaderDropdown>
    );
}

const ListItemIcon = styled(MuiListItemIcon)`
    min-width: 25px;
`;
