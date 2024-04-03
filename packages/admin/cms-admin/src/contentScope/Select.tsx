import { AppHeaderDropdown, ClearInputAdornment } from "@comet/admin";
import { Search } from "@comet/admin-icons";
import {
    InputAdornment,
    InputBase,
    List,
    ListItemButton,
    ListItemIcon as MuiListItemIcon,
    ListItemText,
    ListSubheader,
    SvgIconProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useIntl } from "react-intl";

import { capitalizeString, showLabelIfAvailable, wrapInArray } from "./ContentScope.utils";
import { ContentScopeCombinations } from "./Controls";
import { ContentScopeInterface } from "./Provider";

export interface ContentScopeSelectProps {
    values: ContentScopeCombinations;
    value: ContentScopeInterface;
    onChange: (selectedScopes: ContentScopeInterface[], mapping: string[]) => void;
    label: string;
    icon?:
        | React.ComponentType<SvgIconProps>
        | React.ForwardRefExoticComponent<React.PropsWithoutRef<SvgIconProps> & React.RefAttributes<SVGSVGElement>>;
    disabled?: boolean;
    searchable?: boolean;
}

export default function ContentScopeSelect({
    onChange,
    values,
    value,
    icon,
    label,
    disabled,
    searchable = false,
}: ContentScopeSelectProps): JSX.Element {
    const intl = useIntl();

    const Icon = icon || null;
    // @TODO: styling for disabled-state

    const [searchValue, setSearchValue] = React.useState<string>("");

    const filterBySearchValue = (searchValue: string) => {
        if (!searchValue) return values;
        const groupValues = values.filter((scopeVal) => scopeVal.grouping?.value.includes(searchValue.toLowerCase()));

        const valuesWithSearch = values
            .filter((scopeVal) => !scopeVal.grouping?.value.includes(searchValue.toLowerCase()))
            .map((scopeVal) => ({
                ...scopeVal,
                values: scopeVal.values.filter((val) => val.some(({ value }: { value: string }) => value.includes(searchValue.toLowerCase()))),
            }))
            .filter((scopeVal) => scopeVal.values.length > 0);

        return [...groupValues, ...valuesWithSearch];
    };

    const filteredValues = searchable ? filterBySearchValue(searchValue) : values;
    return (
        <AppHeaderDropdown buttonChildren={label} startIcon={Icon ? <Icon /> : undefined}>
            {(hideDropdown: () => void) => (
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
                    {filteredValues.map(({ grouping, mapping, values }) => {
                        return (
                            <React.Fragment key={JSON.stringify({ grouping, values })}>
                                {grouping && <ListSubheader>{capitalizeString(showLabelIfAvailable(grouping))}</ListSubheader>}
                                {values.map((scopeVal, index) => {
                                    return (
                                        <ListItemButton
                                            key={index}
                                            disabled={disabled}
                                            selected={value.value === scopeVal}
                                            onClick={() => {
                                                hideDropdown();
                                                onChange(
                                                    [...(grouping ? [grouping, ...wrapInArray(scopeVal)] : [...wrapInArray(scopeVal)])],
                                                    mapping,
                                                );
                                                setSearchValue("");
                                            }}
                                        >
                                            {Icon ? (
                                                <ListItemIcon>
                                                    <Icon />
                                                </ListItemIcon>
                                            ) : null}
                                            <ListItemText
                                                primary={
                                                    Array.isArray(scopeVal)
                                                        ? scopeVal.map((val) => showLabelIfAvailable(val)).join(" - ")
                                                        : showLabelIfAvailable(scopeVal)
                                                }
                                            />
                                        </ListItemButton>
                                    );
                                })}
                            </React.Fragment>
                        );
                    })}
                </List>
            )}
        </AppHeaderDropdown>
    );
}

const ListItemIcon = styled(MuiListItemIcon)`
    min-width: 25px;
`;
