import { gql, useApolloClient, useLazyQuery } from "@apollo/client";
import { Clear, Search } from "@comet/admin-icons";
import { type DependencyInterface, useCometConfig, useContentScope } from "@comet/cms-admin";
import {
    CircularProgress,
    ClickAwayListener,
    IconButton,
    InputAdornment,
    InputBase,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Popper,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";

import type { GQLGlobalSearchQuery, GQLGlobalSearchQueryVariables } from "./GlobalSearch.generated";

const globalSearchQuery = gql`
    query GlobalSearch($search: String!, $limit: Int!) {
        fullTextSearch(search: $search, limit: $limit) {
            nodes {
                entityName
                id
                name
                secondaryInformation
            }
            totalCount
        }
    }
`;

const SearchRoot = styled("div")`
    display: flex;
    align-items: center;
    height: 100%;
`;

const SearchInputWrapper = styled("div")(({ theme }) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: theme.shape.borderRadius,
    marginRight: theme.spacing(1),
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.25)",
    },
    transition: theme.transitions.create("width"),
    width: 200,
    "&:focus-within": {
        width: 300,
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    width: "100%",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        fontSize: "0.875rem",
    },
}));

const ResultsPaper = styled(Paper)(({ theme }) => ({
    maxHeight: 400,
    overflow: "auto",
    marginTop: theme.spacing(0.5),
    width: 400,
}));

function GlobalSearch() {
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const history = useHistory();
    const apolloClient = useApolloClient();
    const cometConfig = useCometConfig();
    const entityDependencyMap = cometConfig.dependencies?.entityDependencyMap ?? {};
    const contentScope = useContentScope();
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const intl = useIntl();

    const [executeSearch, { data, loading }] = useLazyQuery<GQLGlobalSearchQuery, GQLGlobalSearchQueryVariables>(globalSearchQuery, {
        fetchPolicy: "network-only",
    });

    const debouncedSearch = useCallback(
        (value: string) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(() => {
                if (value.trim().length > 0) {
                    executeSearch({ variables: { search: value.trim(), limit: 25 } });
                }
            }, 300);
        },
        [executeSearch],
    );

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        if (value.trim().length > 0) {
            setOpen(true);
            debouncedSearch(value);
        } else {
            setOpen(false);
        }
    };

    const handleClear = () => {
        setSearchText("");
        setOpen(false);
    };

    const handleClickAway = () => {
        setOpen(false);
    };

    const handleResultClick = async (entityName: string, id: string) => {
        const dependencyObject = entityDependencyMap[entityName] as DependencyInterface | undefined;
        if (!dependencyObject) {
            return;
        }

        try {
            const path = await dependencyObject.resolvePath({
                apolloClient,
                id,
            });
            const url = contentScope.match.url + path;
            history.push(url);
            setOpen(false);
            setSearchText("");
        } catch {
            // Could not resolve path
        }
    };

    const results = data?.fullTextSearch.nodes ?? [];
    const totalCount = data?.fullTextSearch.totalCount ?? 0;

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <SearchRoot ref={anchorRef}>
                <SearchInputWrapper>
                    <InputAdornment position="start" sx={{ ml: 1, color: "inherit" }}>
                        <Search fontSize="small" />
                    </InputAdornment>
                    <StyledInputBase
                        placeholder={intl.formatMessage({ id: "globalSearch.placeholder", defaultMessage: "Search…" })}
                        value={searchText}
                        onChange={handleInputChange}
                        onFocus={() => {
                            if (searchText.trim().length > 0 && results.length > 0) {
                                setOpen(true);
                            }
                        }}
                        endAdornment={
                            searchText ? (
                                <InputAdornment position="end">
                                    {loading ? (
                                        <CircularProgress size={16} color="inherit" />
                                    ) : (
                                        <IconButton size="small" onClick={handleClear} sx={{ color: "inherit" }}>
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    )}
                                </InputAdornment>
                            ) : null
                        }
                    />
                </SearchInputWrapper>
                <Popper open={open && searchText.trim().length > 0} anchorEl={anchorRef.current} placement="bottom-end" sx={{ zIndex: 1300 }}>
                    <ResultsPaper elevation={8}>
                        {loading && results.length === 0 ? (
                            <List>
                                <ListItem>
                                    <ListItemText primary={<CircularProgress size={20} />} />
                                </ListItem>
                            </List>
                        ) : results.length === 0 ? (
                            <List>
                                <ListItem>
                                    <ListItemText primary={<FormattedMessage id="globalSearch.noResults" defaultMessage="No results found" />} />
                                </ListItem>
                            </List>
                        ) : (
                            <List dense disablePadding>
                                {results.map((result) => {
                                    const hasDependency = !!entityDependencyMap[result.entityName];
                                    return (
                                        <ListItem key={`${result.entityName}-${result.id}`} disablePadding>
                                            <ListItemButton disabled={!hasDependency} onClick={() => handleResultClick(result.entityName, result.id)}>
                                                <ListItemText
                                                    primary={result.name}
                                                    secondary={
                                                        <>
                                                            {result.secondaryInformation && (
                                                                <Typography
                                                                    component="span"
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                    sx={{ display: "block" }}
                                                                >
                                                                    {result.secondaryInformation}
                                                                </Typography>
                                                            )}
                                                            <Typography component="span" variant="caption" color="text.disabled">
                                                                {result.entityName}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                                {totalCount > results.length && (
                                    <ListItem>
                                        <ListItemText
                                            secondary={
                                                <Typography variant="caption" color="text.secondary">
                                                    <FormattedMessage
                                                        id="globalSearch.showingResults"
                                                        defaultMessage="Showing {shown} of {total} results"
                                                        values={{ shown: results.length, total: totalCount }}
                                                    />
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                )}
                            </List>
                        )}
                    </ResultsPaper>
                </Popper>
            </SearchRoot>
        </ClickAwayListener>
    );
}

export { GlobalSearch };
