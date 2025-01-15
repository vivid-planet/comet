/**
 * TODO (Inside this component)
 * - Implement full logic
 * - Implement Styling
 * - Implement Overridability
 * - Refactor with consistence with other components
 * - Reconsider name, maybe "GridTextSearch"
 * - Render our own input on both mobile and desktop
 * - Address TODOs in the code
 * - Can/should we use the existing "lodash.debounce" package?
 *
 * TODO (Other places)
 * - Changeset
 * - Use this component in Storybook/Best-Practice examples
 * - Use this component in generated grids
 * - Use this component in grids from Comet itself
 */

import { ArrowRight, Search } from "@comet/admin-icons";
import { Box, Button, ComponentsOverrides, Fade, InputAdornment, InputBase, Popover, Theme, useThemeProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useGridApiContext } from "@mui/x-data-grid";
import { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { useDebounceCallback } from "usehooks-ts";

import { createComponentSlot } from "../helpers/createComponentSlot";
import { ThemedComponentBaseProps } from "../helpers/ThemedComponentBaseProps";
import { useWindowSize } from "../helpers/useWindowSize";

const defaultSearchValueParser = (searchText: string) => searchText.split(" ").filter((word) => word !== ""); // Copied from @mui/x-data-grid

export type GridTextSearchClassKey = "root";

export type GridTextSearchProps = ThemedComponentBaseProps<{
    root: "div";
}>;

export const GridTextSearch = (inProps: GridTextSearchProps) => {
    const { slotProps, ...restProps } = useThemeProps({
        props: inProps,
        name: "CometAdminGridTextSearch",
    });

    const intl = useIntl();

    const [searchValue, setSearchValue] = useState("");
    const [showSearchInput, setShowSearchInput] = useState(false);

    const apiRef = useGridApiContext();

    const handleSearchSubmit = useCallback(() => {
        setShowSearchInput(false);
        apiRef.current.setQuickFilterValues(defaultSearchValueParser(searchValue));
    }, [apiRef, searchValue]);

    const debouncedSearchSubmit = useDebounceCallback(handleSearchSubmit, 500);

    const headerEl = apiRef.current.headerRef?.current;

    const windowSize = useWindowSize();
    const theme = useTheme();
    const showMobileButton = windowSize.width < theme.breakpoints.values.sm;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchSubmit();

            setTimeout(() => {
                // TODO: Can we fix this?
                // Close again as pressing enter will close the popover -> move the focus back to the button -> the same enter-press will trigger the button click
                setShowSearchInput(false);
            }, 100);

            return;
        }

        if (!showMobileButton) {
            // TODO: This is broken - the value submitted is outdated by one character
            debouncedSearchSubmit();
        }
    };

    const input = (
        <InputBase
            autoFocus
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={intl.formatMessage({ id: "comet.gridTextSearch.placeholder", defaultMessage: "Enter search term" })}
            startAdornment={
                <InputAdornment position="start">
                    <Search />
                </InputAdornment>
            }
        />
    );

    if (!showMobileButton) {
        return (
            <Root {...restProps} {...slotProps?.root}>
                {input}
            </Root>
        );
    }

    return (
        <Root {...restProps} {...slotProps?.root}>
            <Button
                variant="outlined"
                color="info"
                sx={{ minWidth: 0 }}
                onClick={() => {
                    setShowSearchInput(true);
                }}
            >
                <Search />
            </Button>
            <Popover
                TransitionComponent={Fade}
                open={showSearchInput}
                onClose={() => setShowSearchInput(false)}
                anchorEl={headerEl}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "left",
                }}
                slotProps={{ backdrop: { invisible: false } }}
                sx={{
                    "& .MuiPopover-paper": {
                        background: "transparent",
                    },
                }}
            >
                <Box
                    sx={{
                        p: 2,
                        boxSizing: "border-box",
                        width: headerEl?.clientWidth,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            background: "white",
                            ".MuiInputBase-root": { flexGrow: 1 },
                            borderRadius: 4,
                        }}
                    >
                        {input}
                        <Button variant="contained" color="primary" sx={{ minWidth: 0 }} onClick={handleSearchSubmit}>
                            <ArrowRight />
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </Root>
    );
};

const Root = createComponentSlot("div")<GridTextSearchClassKey>({
    componentName: "GridTextSearch",
    slotName: "root",
})();

declare module "@mui/material/styles" {
    interface ComponentsPropsList {
        CometAdminGridTextSearch: GridTextSearchProps;
    }

    interface ComponentNameToClassKey {
        CometAdminGridTextSearch: GridTextSearchClassKey;
    }

    interface Components {
        CometAdminGridTextSearch?: {
            defaultProps?: Partial<ComponentsPropsList["CometAdminGridTextSearch"]>;
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminGridTextSearch"];
        };
    }
}
