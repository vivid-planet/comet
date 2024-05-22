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

import { ContentScopeInterface } from "./Provider";

export interface ContentScopeSelectProps {
    values: {
        group: { key: string; value: ContentScopeInterface };
        values: ContentScopeInterface[];
    }[];
    value: ContentScopeInterface;
    onChange: (selectedScope: ContentScopeInterface) => void;
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

    const filterBySearchValue = (
        searchValue: string,
    ): {
        group: { key: string; value: ContentScopeInterface };
        values: ContentScopeInterface[];
    }[] => {
        if (!searchValue) return values;
        const valuesWithId = values.map((value, index) => ({ id: index, ...value }));
        const groupValues = valuesWithId.filter((scopeVal) => scopeVal.group?.value.includes(searchValue.toLowerCase()));

        const valuesWithSearch = valuesWithId
            .filter((scopeVal) => !scopeVal.group?.value.includes(searchValue.toLowerCase()))
            .map((scopeVal) => {
                return {
                    ...scopeVal,
                    values: scopeVal.values.filter((val) => {
                        return Object.keys(val)
                            .map((key) => val[key])
                            .some(({ label, value }: { value: string; label?: string }) => {
                                return value.includes(searchValue.toLowerCase()) || label?.toLowerCase().includes(searchValue.toLowerCase());
                            });
                    }),
                };
            })
            .filter((scopeVal) => scopeVal.values.length > 0);

        return [...groupValues, ...valuesWithSearch].sort((a, b) => a.id - b.id);
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
                    {filteredValues.map(({ group: { key, value }, values }) => {
                        return (
                            <React.Fragment key={value.value}>
                                {Object.keys(values[0]).length > 1 && <ListSubheader>{capitalizeString(showLabelIfAvailable(value))}</ListSubheader>}
                                {values.map((scopeVal, index) => {
                                    return (
                                        <ListItemButton
                                            key={index}
                                            disabled={disabled}
                                            selected={value === scopeVal}
                                            onClick={() => {
                                                hideDropdown();
                                                onChange(scopeVal);
                                                setSearchValue("");
                                            }}
                                        >
                                            {Icon ? (
                                                <ListItemIcon>
                                                    <Icon />
                                                </ListItemIcon>
                                            ) : null}
                                            <ListItemText primary={joinLabels(scopeVal, key)} />
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

const capitalizeString = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

const showLabelIfAvailable = (val: ContentScopeInterface) => (val.label ? val.label : val.value);

const joinLabels = (scope: ContentScopeInterface, groupKey: string) =>
    Object.keys(scope)
        .filter((key) => key !== groupKey)
        .map((key) => capitalizeString(showLabelIfAvailable(scope[key])))
        .join(" - ");
