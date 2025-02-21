import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type PropsWithChildren } from "react";

import { useScrollRestoration } from "./useScrollRestoration";

interface TabContentProps {
    selectedTab?: string;
}

export const TabContent = ({ children, selectedTab }: PropsWithChildren<TabContentProps>) => {
    const scrollRestoration = useScrollRestoration<HTMLDivElement>(`adminTabsTabContent-${selectedTab}`);
    return (
        <Root {...scrollRestoration}>
            <Box marginBottom={4} marginTop={4}>
                {children}
            </Box>
        </Root>
    );
};

const Root = styled("div")`
    overflow-y: auto;
    overflow-x: hidden;
`;
