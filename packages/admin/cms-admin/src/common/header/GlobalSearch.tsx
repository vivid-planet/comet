import { gql, useApolloClient, useLazyQuery } from "@apollo/client";
import { Clear, Search } from "@comet/admin-icons";
import {
    Chip,
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
import { alpha, styled } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router";

import { useContentScope } from "../../contentScope/Provider";
import { useDependenciesConfig } from "../../dependencies/dependenciesConfig";
import type { DependencyInterface } from "../../dependencies/types";
import { findTextMatches, MarkedMatches } from "../MarkedMatches";
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

type SearchResult = {
    entityName: string;
    id: string;
    name: string;
    secondaryInformation: string | null;
};

function humanizeEntityName(entityName: string) {
    return entityName.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
}

function GlobalSearch() {
    const [searchText, setSearchText] = useState("");
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);
    const history = useHistory();
    const apolloClient = useApolloClient();
    const { entityDependencyMap } = useDependenciesConfig();
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
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error(`Could not resolve path for ${entityName} (${id}):`, error);
            }
        }
    };

    const results = useMemo<SearchResult[]>(() => data?.fullTextSearch.nodes ?? [], [data]);
    const totalCount = data?.fullTextSearch.totalCount ?? 0;

    const trimmedSearch = searchText.trim();
    const showPopper = open && trimmedSearch.length > 0;

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <SearchRoot ref={anchorRef}>
                <SearchInputWrapper focused={open}>
                    <SearchIconWrapper>
                        <Search fontSize="small" />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder={intl.formatMessage({ id: "comet.globalSearch.placeholder", defaultMessage: "Search…" })}
                        value={searchText}
                        onChange={handleInputChange}
                        onFocus={() => {
                            if (trimmedSearch.length > 0) {
                                setOpen(true);
                            }
                        }}
                        endAdornment={
                            <InputAdornment position="end" sx={{ mr: 0.5 }}>
                                {loading ? (
                                    <CircularProgress size={14} color="inherit" />
                                ) : searchText ? (
                                    <ClearButton
                                        size="small"
                                        onClick={handleClear}
                                        aria-label={intl.formatMessage({
                                            id: "comet.globalSearch.clear",
                                            defaultMessage: "Clear search",
                                        })}
                                    >
                                        <Clear sx={{ fontSize: 16 }} />
                                    </ClearButton>
                                ) : null}
                            </InputAdornment>
                        }
                    />
                </SearchInputWrapper>
                <Popper
                    open={showPopper}
                    anchorEl={anchorRef.current}
                    placement="bottom-end"
                    sx={{ zIndex: (theme) => theme.zIndex.appBar + 1 }}
                    modifiers={[{ name: "offset", options: { offset: [0, 6] } }]}
                >
                    <ResultsPaper elevation={8}>
                        {loading && results.length === 0 ? (
                            <LoadingState>
                                <CircularProgress size={24} />
                            </LoadingState>
                        ) : results.length === 0 ? (
                            <EmptyState>
                                <Search sx={{ fontSize: 32, opacity: 0.4 }} />
                                <Typography variant="body2" color="text.secondary">
                                    <FormattedMessage id="comet.globalSearch.noResults" defaultMessage="No results found" />
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    <FormattedMessage id="comet.globalSearch.noResultsHint" defaultMessage="Try a different search term" />
                                </Typography>
                            </EmptyState>
                        ) : (
                            <>
                                <ResultsScroll>
                                    <List dense disablePadding>
                                        {results.map((result) => {
                                            const dependency = entityDependencyMap[result.entityName] as DependencyInterface | undefined;
                                            const hasDependency = !!dependency;
                                            const matches = findTextMatches(result.name, trimmedSearch);
                                            const rawDisplayName = dependency?.displayName;
                                            const entityLabel =
                                                typeof rawDisplayName === "string"
                                                    ? humanizeEntityName(rawDisplayName)
                                                    : (rawDisplayName ?? humanizeEntityName(result.entityName));
                                            return (
                                                <ListItem key={`${result.entityName}-${result.id}`} disablePadding>
                                                    <ResultItemButton
                                                        disabled={!hasDependency}
                                                        onClick={() => handleResultClick(result.entityName, result.id)}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <PrimaryText>
                                                                    <MarkedMatches text={result.name} matches={matches} />
                                                                </PrimaryText>
                                                            }
                                                            secondary={
                                                                result.secondaryInformation ? (
                                                                    <SecondaryText>{result.secondaryInformation}</SecondaryText>
                                                                ) : null
                                                            }
                                                            slotProps={{ secondary: { component: "div" } }}
                                                        />
                                                        <EntityChip label={entityLabel} size="small" />
                                                    </ResultItemButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                </ResultsScroll>
                                {totalCount > results.length && (
                                    <>
                                        <FooterDivider />
                                        <ResultsFooter>
                                            <FormattedMessage
                                                id="comet.globalSearch.showingResults"
                                                defaultMessage="Showing {shown} of {total} results"
                                                values={{ shown: results.length, total: totalCount }}
                                            />
                                        </ResultsFooter>
                                    </>
                                )}
                            </>
                        )}
                    </ResultsPaper>
                </Popper>
            </SearchRoot>
        </ClickAwayListener>
    );
}

const SearchRoot = styled("div")`
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 ${({ theme }) => theme.spacing(2)};
`;

const SearchInputWrapper = styled("div", { shouldForwardProp: (prop) => prop !== "focused" })<{ focused: boolean }>(({ theme, focused }) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    height: 36,
    backgroundColor: alpha(theme.palette.common.white, focused ? 0.22 : 0.12),
    border: `1px solid ${alpha(theme.palette.common.white, focused ? 0.4 : 0.2)}`,
    borderRadius: 999,
    transition: theme.transitions.create(["width", "background-color", "border-color"], {
        duration: theme.transitions.duration.shorter,
    }),
    width: 220,
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.2),
    },
    "&:focus-within": {
        width: 360,
        backgroundColor: alpha(theme.palette.common.white, 0.22),
        borderColor: alpha(theme.palette.common.white, 0.45),
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    color: alpha(theme.palette.common.white, 0.85),
    pointerEvents: "none",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.common.white,
    flex: 1,
    backgroundColor: "transparent",
    border: "none",
    "&.Mui-focused": {
        border: "none",
        boxShadow: "none",
    },
    "& .MuiInputBase-input": {
        padding: theme.spacing(0, 1, 0, 0),
        fontSize: "0.875rem",
        lineHeight: "34px",
        height: "34px",
        boxSizing: "border-box",
        "&::placeholder": {
            color: alpha(theme.palette.common.white, 0.7),
            opacity: 1,
        },
    },
}));

const ClearButton = styled(IconButton)(({ theme }) => ({
    color: alpha(theme.palette.common.white, 0.85),
    padding: 4,
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        color: theme.palette.common.white,
    },
}));

const ResultsPaper = styled(Paper)(({ theme }) => ({
    marginTop: 0,
    width: 420,
    maxWidth: "calc(100vw - 32px)",
    overflow: "hidden",
    borderRadius: 8,
}));

const ResultsScroll = styled("div")`
    max-height: 440px;
    overflow-y: auto;
`;

const ResultItemButton = styled(ListItemButton)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    alignItems: "flex-start",
    gap: theme.spacing(1.5),
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}));

const EntityChip = styled(Chip)(({ theme }) => ({
    marginTop: 2,
    marginLeft: "auto",
    flexShrink: 0,
    height: 20,
    fontSize: "0.6875rem",
    fontWeight: 500,
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.action.selected,
    "& .MuiChip-label": {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
}));

const FooterDivider = styled("div")(({ theme }) => ({
    height: 1,
    backgroundColor: theme.palette.divider,
}));

const PrimaryText = styled("span")`
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.primary};
    line-height: 1.3;
    word-break: break-word;
`;

const SecondaryText = styled("span")`
    display: -webkit-box;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    word-break: break-word;
`;

const LoadingState = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
}));

const EmptyState = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4, 3),
    gap: theme.spacing(1),
    color: theme.palette.text.secondary,
}));

const ResultsFooter = styled("div")(({ theme }) => ({
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.text.secondary,
    fontSize: "0.75rem",
    textAlign: "center",
}));

export { GlobalSearch };
