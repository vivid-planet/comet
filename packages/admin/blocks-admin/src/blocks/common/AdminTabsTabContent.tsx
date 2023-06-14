import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { useScrollRestoration } from "../../common/useScrollRestoration";

interface TabContentProps {
    children: React.ReactNode;
    selectedTab?: string;
}

export function TabContent({ children, selectedTab }: TabContentProps): React.ReactElement {
    const scrollRestoration = useScrollRestoration<HTMLDivElement>(`adminTabsTabContent-${selectedTab}`);
    return (
        <Root {...scrollRestoration}>
            <Box marginBottom={4} marginTop={4}>
                {children}
            </Box>
        </Root>
    );
}

const Root = styled("div")`
    overflow-y: auto;
    overflow-x: hidden;
`;
