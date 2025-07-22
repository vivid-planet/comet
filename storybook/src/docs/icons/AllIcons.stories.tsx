import { ClearInputAdornment } from "@comet/admin";
import * as imports from "@comet/admin-icons";
import { Grid, InputAdornment, InputBase, type SvgIconProps, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type ComponentType, useState } from "react";
import { useDebounce } from "use-debounce";

const matchesSearchQuery = (str: string, query: string): boolean => {
    if (!query.length) return true;

    let strIncludesPartOfSearchQuery = false;

    query.split(" ").forEach((part) => {
        if (str.toLowerCase().includes(part.trim())) {
            strIncludesPartOfSearchQuery = true;
        }
    });

    return strIncludesPartOfSearchQuery;
};

const SearchBarRoot = styled("div")`
    margin-bottom: 40px;
`;

const IconContainer = styled("div")`
    padding: 10px;
    display: flex;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.palette.grey[100]};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    background-color: ${({ theme }) => theme.palette.background.paper};
`;

const IconWrapper = styled("div")`
    display: flex;
    align-items: center;
    margin-right: 10px;
`;

const SearchIcon = imports.Search;
const icons = Object.fromEntries(Object.entries(imports).filter(([key]) => !key.endsWith("SearchTerms") && key !== "__esModule"));

const searchTerms = Object.fromEntries(
    Object.keys(icons)
        .map((key) => {
            const searchKey = `${key}SearchTerms`;
            return searchKey in imports ? [key, (imports as unknown as Record<string, string>)[searchKey]] : null;
        })
        .filter(Boolean) as [string, string][],
);

const IconsGrid = ({ searchQuery }: { searchQuery: string }) => (
    <Grid container spacing={4}>
        {Object.keys(icons).map((key) => {
            const searchString = searchTerms[key] ?? key;
            if (matchesSearchQuery(searchString, searchQuery)) {
                const Icon = icons[key] as ComponentType<SvgIconProps>;
                return (
                    <Grid
                        key={key}
                        size={{
                            xs: 12,
                            sm: 6,
                            md: 4,
                            lg: 3,
                        }}
                    >
                        <IconContainer>
                            <IconWrapper>
                                <Icon fontSize="large" />
                            </IconWrapper>
                            <Typography>{key}</Typography>
                        </IconContainer>
                    </Grid>
                );
            }
        })}
    </Grid>
);

export default {
    title: "Docs/Icons/All Icons",
};

export const AllIcons = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [debouncedSearchQuery] = useDebounce(searchQuery.trim().toLowerCase(), 500);

    return (
        <>
            <SearchBarRoot>
                <InputBase
                    fullWidth
                    value={searchQuery}
                    autoFocus
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                    endAdornment={
                        debouncedSearchQuery.length !== 0 && (
                            <InputAdornment position="end">
                                <ClearInputAdornment
                                    position="end"
                                    hasClearableContent={Boolean(debouncedSearchQuery.length !== 0)}
                                    onClick={() => setSearchQuery("")}
                                />
                            </InputAdornment>
                        )
                    }
                    placeholder="Search icons by name"
                />
            </SearchBarRoot>
            <IconsGrid searchQuery={debouncedSearchQuery} />
        </>
    );
};
