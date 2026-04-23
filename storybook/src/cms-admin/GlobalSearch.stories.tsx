import { AppHeader, AppHeaderMenuButton, CometLogo, FillSpace } from "@comet/admin";
import { Clear, Search } from "@comet/admin-icons";
import { findTextMatches, MarkedMatches } from "@comet/cms-admin";
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
import type { Meta } from "@storybook/react-webpack5";
import { type ReactNode, useEffect, useMemo, useState } from "react";

type SearchResult = {
    entityName: string;
    id: string;
    name: string;
    secondaryInformation: string | null;
};

const demoResults: SearchResult[] = [
    { entityName: "Page", id: "1", name: "Homepage", secondaryInformation: "/en" },
    { entityName: "Page", id: "2", name: "About us", secondaryInformation: "/en/about" },
    { entityName: "Page", id: "3", name: "Contact", secondaryInformation: "/en/contact" },
    { entityName: "News", id: "4", name: "New product launch", secondaryInformation: "Published 2024-02-10" },
    { entityName: "News", id: "5", name: "Company anniversary celebration", secondaryInformation: "Published 2024-01-15" },
    { entityName: "Product", id: "6", name: "Running Shoes", secondaryInformation: "Category: Footwear · Acme Inc." },
    {
        entityName: "Product",
        id: "7",
        name: "Bluetooth Headphones with Noise Cancellation and Long Battery Life",
        secondaryInformation: "Category: Audio · SoundCorp",
    },
    { entityName: "Manufacturer", id: "8", name: "Acme Inc.", secondaryInformation: null },
];

const entityLabels: Record<string, ReactNode> = {
    Page: "Pages",
    News: "News",
    Product: "Products",
    Manufacturer: "Manufacturers",
};

function GlobalSearchDemo({
    initialQuery = "",
    staticResults,
    loading = false,
    forceOpen,
}: {
    initialQuery?: string;
    staticResults?: SearchResult[];
    loading?: boolean;
    forceOpen?: boolean;
}) {
    const [searchText, setSearchText] = useState(initialQuery);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

    useEffect(() => {
        if (forceOpen || initialQuery.length > 0) {
            setOpen(true);
        }
    }, [forceOpen, initialQuery]);

    const results: SearchResult[] = useMemo(() => {
        if (staticResults) {
            return staticResults;
        }
        if (!searchText.trim()) {
            return [];
        }
        const lower = searchText.trim().toLowerCase();
        return demoResults.filter(
            (r) =>
                r.name.toLowerCase().includes(lower) ||
                (r.secondaryInformation ?? "").toLowerCase().includes(lower) ||
                r.entityName.toLowerCase().includes(lower),
        );
    }, [searchText, staticResults]);

    const totalCount = staticResults ? staticResults.length + 12 : results.length;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        setOpen(e.target.value.trim().length > 0);
    };

    const handleClear = () => {
        setSearchText("");
        setOpen(false);
    };

    const trimmedSearch = searchText.trim();
    const showPopper = (forceOpen ?? open) && (trimmedSearch.length > 0 || !!staticResults);

    return (
        <ClickAwayListener onClickAway={() => !forceOpen && setOpen(false)}>
            <SearchRoot ref={setAnchorEl}>
                <SearchInputWrapper focused={open}>
                    <SearchIconWrapper>
                        <Search fontSize="small" />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
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
                                    <ClearButton size="small" onClick={handleClear} aria-label="clear">
                                        <Clear sx={{ fontSize: 16 }} />
                                    </ClearButton>
                                ) : null}
                            </InputAdornment>
                        }
                    />
                </SearchInputWrapper>
                <Popper
                    open={showPopper}
                    anchorEl={anchorEl}
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
                                    No results found
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    Try a different search term
                                </Typography>
                            </EmptyState>
                        ) : (
                            <>
                                <ResultsScroll>
                                    <List dense disablePadding>
                                        {results.map((result) => {
                                            const matches = findTextMatches(result.name, trimmedSearch);
                                            const entityLabel = entityLabels[result.entityName] ?? result.entityName;
                                            return (
                                                <ListItem key={`${result.entityName}-${result.id}`} disablePadding>
                                                    <ResultItemButton>
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
                                            Showing {results.length} of {totalCount} results
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

export default {
    title: "@comet/cms-admin/Global Search",
    parameters: { layout: "fullscreen" },
    decorators: [
        (Story) => (
            <AppHeader position="relative" headerHeight={60}>
                <AppHeaderMenuButton />
                <CometLogo color="white" />
                <FillSpace />
                <Story />
            </AppHeader>
        ),
    ],
} as Meta;

export const Empty = {
    render: () => <GlobalSearchDemo />,
    name: "Empty (idle)",
};

export const WithResults = {
    render: () => <GlobalSearchDemo initialQuery="run" />,
    name: "With results",
};

export const ManyResults = {
    render: () => <GlobalSearchDemo forceOpen staticResults={demoResults} />,
    name: "Grouped results with footer",
};

export const NoResults = {
    render: () => <GlobalSearchDemo initialQuery="zzz-nothing-here" />,
    name: "No results",
};

export const Loading = {
    render: () => <GlobalSearchDemo forceOpen loading staticResults={[]} />,
};
