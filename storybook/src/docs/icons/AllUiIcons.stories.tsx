import { ClearInputAdornment } from "@dextinity/admin";
import { Search } from "@dextinity/admin-icons";
import * as icons from "@dextinity/icons";
import { InputAdornment, InputBase, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const SearchBarRoot = styled("div")`
    margin-bottom: 40px;
`;

const IconsGridRoot = styled("div")`
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: 1fr;
    gap: ${({ theme }) => theme.spacing(4)};

    ${({ theme }) => theme.breakpoints.up("sm")} {
        grid-template-columns: repeat(2, 1fr);
    }

    ${({ theme }) => theme.breakpoints.up("md")} {
        grid-template-columns: repeat(3, 1fr);
    }

    ${({ theme }) => theme.breakpoints.up("lg")} {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const IconContainer = styled("div")`
    box-sizing: border-box;
    height: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.palette.grey[100]};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    background-color: ${({ theme }) => theme.palette.background.paper};

    .dextinityIcon {
        flex: 0 0 auto;
        width: 24px;
        height: 24px;
        margin-right: 10px;
    }
`;

const IconLabel = styled("div")`
    min-width: 0;
`;

const SearchTerms = styled(Typography)`
    display: block;
`;

const iconsWithNames = Object.entries(icons).map(([name, Icon]) => ({ name, Icon }));

const matchesSearchQuery = ({ name, Icon }: (typeof iconsWithNames)[number], searchQuery: string): boolean => {
    const words = [name, ...Icon.searchTerms].map((word) => word.toLowerCase());
    return searchQuery.split(" ").some((part) => words.some((word) => word.includes(part)));
};

const IconsGrid = ({ searchQuery }: { searchQuery: string }) => (
    <IconsGridRoot>
        {iconsWithNames
            .filter((icon) => matchesSearchQuery(icon, searchQuery))
            .map(({ name, Icon }) => (
                <IconContainer key={name}>
                    <Icon />
                    <IconLabel>
                        <Typography noWrap title={name}>
                            {name}
                        </Typography>
                        {Icon.searchTerms.length > 0 && (
                            <SearchTerms variant="caption" color="textSecondary" noWrap title={Icon.searchTerms.join(", ")}>
                                {Icon.searchTerms.join(", ")}
                            </SearchTerms>
                        )}
                    </IconLabel>
                </IconContainer>
            ))}
    </IconsGridRoot>
);

export default {
    title: "Docs/Icons and Logo/Dextinity Icons",
    tags: ["!dev", "!autodocs"],
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
                    onChange={(event) => setSearchQuery(event.currentTarget.value)}
                    startAdornment={
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    }
                    endAdornment={
                        debouncedSearchQuery.length !== 0 && (
                            <InputAdornment position="end">
                                <ClearInputAdornment position="end" onClick={() => setSearchQuery("")} />
                            </InputAdornment>
                        )
                    }
                    placeholder="Search icons by name or search term"
                />
            </SearchBarRoot>
            <IconsGrid searchQuery={debouncedSearchQuery} />
        </>
    );
};
