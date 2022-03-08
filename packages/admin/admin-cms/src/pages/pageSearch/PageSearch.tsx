import { ChevronDown, ChevronUp, Clear, Search } from "@comet/admin-icons";
import { IconButton, InputAdornment, InputBase, Typography } from "@material-ui/core";
import React from "react";
import { useHotkeys, useIsHotkeyPressed } from "react-hotkeys-hook";
import styled from "styled-components";
import { useDebouncedCallback } from "use-debounce";

import { PageSearchApi } from "./usePageSearch";

interface PageSearchProps {
    query: string;
    onQueryChange: (query: string) => void;
    pageSearchApi: PageSearchApi;
}

export function PageSearch({ query, onQueryChange, pageSearchApi }: PageSearchProps): React.ReactElement {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [internalQuery, setInternalQuery] = React.useState(query);
    const isPressed = useIsHotkeyPressed();

    const debouncedOnQueryChange = useDebouncedCallback(onQueryChange, 250);

    React.useEffect(() => {
        setInternalQuery(query);
    }, [query]);

    const updateQuery = (newQuery: string) => {
        setInternalQuery(newQuery);

        debouncedOnQueryChange.callback(newQuery);

        if (newQuery === "") {
            debouncedOnQueryChange.flush();
        }
    };

    useHotkeys("ctrl+f, command+f", (event) => {
        event.preventDefault();
        inputRef.current?.focus();
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateQuery(event.target.value);
    };

    const handleClearClick = () => {
        updateQuery("");
        inputRef.current?.focus();
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "Enter":
                if (isPressed("shift")) {
                    pageSearchApi?.jumpToPreviousMatch?.();
                } else {
                    pageSearchApi?.jumpToNextMatch?.();
                }

                break;

            case "Escape":
                updateQuery("");
                inputRef.current?.blur();

                break;
        }
    };

    return (
        <Root>
            <InputBase
                inputRef={inputRef}
                value={internalQuery || ""}
                onChange={handleInputChange}
                onKeyUp={handleKeyUp}
                placeholder="Search"
                fullWidth
                startAdornment={
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                }
                endAdornment={
                    internalQuery ? (
                        <InputAdornment position="end">
                            <Typography>
                                {pageSearchApi.currentMatch !== undefined && pageSearchApi.totalMatches !== undefined
                                    ? `${pageSearchApi.currentMatch}/${pageSearchApi.totalMatches}`
                                    : "..."}
                            </Typography>
                            <IconButton onClick={pageSearchApi?.jumpToPreviousMatch} disabled={!pageSearchApi?.jumpToPreviousMatch}>
                                <ChevronUp />
                            </IconButton>
                            <IconButton onClick={pageSearchApi?.jumpToNextMatch} disabled={!pageSearchApi?.jumpToNextMatch}>
                                <ChevronDown />
                            </IconButton>
                            <IconButton onClick={handleClearClick}>
                                <Clear />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }
            />
        </Root>
    );
}

const Root = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
`;
