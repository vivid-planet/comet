import { Box } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";

import { useScrollRestoration } from "../../common/useScrollRestoration";

interface TabContentProps {
    children: React.ReactNode;
    selectedTab?: string;
}

export function TabContent({ children, selectedTab }: TabContentProps): React.ReactElement {
    const scrollRestoration = useScrollRestoration<HTMLDivElement>(`adminTabsTabContent-${selectedTab}`);
    return (
        <Root {...scrollRestoration}>
            <Box marginBottom={4}>{children}</Box>
        </Root>
    );
}

const Root = styled.div`
    overflow-y: auto;
    overflow-x: hidden;
`;
