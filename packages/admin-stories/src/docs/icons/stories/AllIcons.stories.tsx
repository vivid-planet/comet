import { ClearInputButton } from "@comet/admin";
import * as icons from "@comet/admin-icons";
import { Grid, InputAdornment, InputBase, SvgIcon, Typography } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import styled from "styled-components";
import { useDebounce } from "use-debounce";

const matchesSearchQuery = (str: string, query: string): boolean => {
    if (!query.length) return true;

    let strIncludesPartOfSearchQuery: boolean = false;

    query.split(" ").forEach((part) => {
        if (str.toLowerCase().includes(part.trim())) {
            strIncludesPartOfSearchQuery = true;
        }
    });

    return strIncludesPartOfSearchQuery;
};

const SearchBarRoot = styled.div`
    margin-bottom: 40px;
`;

const IconContainer = styled.div`
    padding: 10px;
    display: flex;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.palette.grey[100]};
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    background-color: ${({ theme }) => theme.palette.background.paper};
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-right: 10px;
`;

const SearchIcon = icons.Search;

const IconsGird = ({ searchQuery }: { searchQuery: string }): React.ReactElement => {
    return (
        <Grid container spacing={4}>
            {Object.keys(icons).map((key) => {
                if (key !== "__esModule" && key != null && matchesSearchQuery(key, searchQuery)) {
                    const Icon = (icons as { [key: string]: typeof SvgIcon })[key];

                    return (
                        <Grid item key={key} xs={12} sm={6} md={4} lg={3}>
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
};

storiesOf("stories/Icons", module).add("All Icons", () => {
    const [searchQuery, setSearchQuery] = React.useState<string>("");
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
                                <ClearInputButton onClick={() => setSearchQuery("")} />
                            </InputAdornment>
                        )
                    }
                    placeholder="Search icons by name"
                />
            </SearchBarRoot>
            <IconsGird searchQuery={debouncedSearchQuery} />
        </>
    );
});
