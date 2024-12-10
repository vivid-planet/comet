import { AppHeaderDropdown, ClearInputAdornment } from "@comet/admin";
import { Domain, Search } from "@comet/admin-icons";
import {
    Box,
    Divider,
    InputAdornment,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Typography,
    useTheme,
} from "@mui/material";
import { capitalCase } from "change-case";
import { Fragment, ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { findTextMatches, MarkedMatches } from "../common/MarkedMatches";
import { ContentScopeInterface } from "./Provider";

type Option<Value extends ContentScopeInterface = ContentScopeInterface> = {
    [Key in keyof Value]: { label?: string; value: Value[Key] };
};

interface Props<Value extends ContentScopeInterface> {
    value: Value;
    onChange: (value: Value) => void;
    options: Array<Option<Value>>;
    searchable?: boolean;
    groupBy?: keyof Value;
    icon?: ReactNode;
    renderOption?: (option: Option<Value>, query?: string) => ReactNode;
    renderSelectedOption?: (option: Option<Value>) => ReactNode;
}

export function ContentScopeSelect<Value extends ContentScopeInterface = ContentScopeInterface>({
    value,
    onChange,
    options,
    searchable,
    groupBy,
    icon = <Domain />,
    renderOption,
    renderSelectedOption,
}: Props<Value>) {
    const intl = useIntl();
    const [searchValue, setSearchValue] = useState<string>("");
    const theme = useTheme();

    const hasMultipleDimensions = Object.keys(value).length > 1;

    let filteredOptions = options;

    if (searchable) {
        filteredOptions = options.filter((option) => {
            return Object.values(option).some(({ label, value }) => {
                return value.toLowerCase().includes(searchValue.toLowerCase()) || label?.toLowerCase().includes(searchValue.toLowerCase());
            });
        });
    }

    let groups: Array<{ value: string; label: string | undefined; options: Option<Value>[] }> = [];

    if (groupBy) {
        if (hasMultipleDimensions) {
            for (const option of filteredOptions) {
                const groupForOption = groups.find((group) => group.value === option[groupBy].value);

                if (groupForOption) {
                    groupForOption.options.push(option);
                } else {
                    groups.push({ value: option[groupBy].value, label: option[groupBy].label, options: [option] });
                }
            }
        } else {
            console.warn("ContentScopeSelect: groupBy is set but only one dimension is present. Ignoring groupBy.");
            groups = [{ value: "", label: "", options: filteredOptions }];
        }
    } else {
        groups = [{ value: "", label: "", options: filteredOptions }];
    }

    const selectedOption = options.find((option) => {
        return Object.keys(option).every((key) => value[key] === option[key].value);
    });

    if (!selectedOption) {
        throw new Error("ContentScopeSelect: Can't find provided value in options.");
    }

    if (!renderOption) {
        renderOption = (option, query) => {
            const text = Object.entries(option)
                .filter(([dimension]) => (hasMultipleDimensions && groupBy ? dimension !== groupBy : true))
                .map(([, option]) => option.label ?? option.value)
                .join(" – ");
            const matches = findTextMatches(text, query);
            return (
                <ListItemText
                    primaryTypographyProps={{ variant: "body2" }}
                    sx={{ margin: 0 }}
                    primary={<MarkedMatches text={text} matches={matches} />}
                />
            );
        };
    }

    if (!renderSelectedOption) {
        renderSelectedOption = (option) => {
            return Object.values(option)
                .map((option) => humanReadableLabel(option))
                .join(" / ");
        };
    }

    return (
        <AppHeaderDropdown
            buttonChildren={renderSelectedOption(selectedOption)}
            startIcon={icon}
            slotProps={{
                popover: {
                    anchorOrigin: { vertical: "bottom", horizontal: "left" },
                    transformOrigin: { vertical: "top", horizontal: "left" },
                    PaperProps: {
                        sx: {
                            minWidth: "350px",
                        },
                    },
                },
            }}
        >
            {(hideDropdown) => (
                <>
                    {searchable && (
                        <>
                            <Box sx={{ px: 3, py: 2 }}>
                                <InputBase
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Search htmlColor={theme.palette.grey[900]} />
                                        </InputAdornment>
                                    }
                                    placeholder={intl.formatMessage({
                                        id: "contentScopeSelect.searchInput.placeholder",
                                        defaultMessage: "Search...",
                                    })}
                                    value={searchValue}
                                    onChange={(event) => setSearchValue(event.currentTarget.value)}
                                    endAdornment={
                                        <ClearInputAdornment
                                            onClick={() => setSearchValue("")}
                                            hasClearableContent={searchValue !== ""}
                                            position="end"
                                        />
                                    }
                                    autoFocus
                                    fullWidth
                                />
                            </Box>
                            <Divider />
                        </>
                    )}
                    <List>
                        {groups.map((group, index) => {
                            const showGroupHeader = hasMultipleDimensions;
                            const showGroupDivider = showGroupHeader && index !== groups.length - 1;
                            const groupLabel = humanReadableLabel(group);
                            const matches = findTextMatches(groupLabel, searchValue);

                            return (
                                <Fragment key={group.value}>
                                    {showGroupHeader && (
                                        <ListSubheader
                                            sx={{
                                                paddingX: (theme) => theme.spacing(3),
                                                paddingTop: (theme) => theme.spacing(4),
                                                paddingBottom: (theme) => theme.spacing(2),
                                                lineHeight: "inherit",
                                            }}
                                        >
                                            <Typography variant="overline" color={(theme) => theme.palette.grey[500]}>
                                                {matches ? <MarkedMatches text={groupLabel} matches={matches} /> : groupLabel}
                                            </Typography>
                                        </ListSubheader>
                                    )}
                                    {group.options.map((option) => (
                                        <ListItemButton
                                            key={JSON.stringify(option)}
                                            onClick={() => {
                                                hideDropdown();
                                                onChange(optionToValue<Value>(option));
                                                setSearchValue("");
                                            }}
                                            selected={option === selectedOption}
                                            sx={{ paddingX: (theme) => theme.spacing(6) }}
                                        >
                                            {renderOption?.(option, searchValue)}
                                        </ListItemButton>
                                    ))}
                                    {showGroupDivider && <Divider sx={{ margin: 2, borderColor: "grey.50" }} />}
                                </Fragment>
                            );
                        })}
                        {filteredOptions.length === 0 && (
                            <ListItem>
                                <FormattedMessage id="contentScopeSelect.list.noOptions" defaultMessage="No options" />
                            </ListItem>
                        )}
                    </List>
                </>
            )}
        </AppHeaderDropdown>
    );
}

function optionToValue<Value extends ContentScopeInterface = ContentScopeInterface>(option: Option<Value>): Value {
    const value: Record<string, unknown> = {};

    Object.keys(option).forEach((key) => {
        value[key] = option[key].value;
    });

    return value as Value;
}

function humanReadableLabel({ label, value }: { label?: string; value: string }) {
    return label ?? capitalCase(value);
}
