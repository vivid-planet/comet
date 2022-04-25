import { TreeCollapse, TreeExpand } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

import { PageTreePage } from "./usePageTree";

interface PageInfoProps {
    page: PageTreePage;
    toggleExpand: (id: string) => void;
    children: React.ReactNode;
}

const ExpandIconWrapper = styled("div")`
    margin-top: -12px;
    margin-bottom: -10px;
    width: 44px;
`;

export default function PageInfo({ page, toggleExpand, children }: PageInfoProps): React.ReactElement {
    return (
        <Root style={{ paddingLeft: `${page.level * 33}px` }}>
            <ExpandIconWrapper>
                {page.expanded !== null && (
                    <IconButton
                        onClick={() => {
                            toggleExpand(page.id);
                        }}
                        size="large"
                    >
                        {page.expanded ? <TreeCollapse /> : <TreeExpand />}
                    </IconButton>
                )}
            </ExpandIconWrapper>
            {children}
        </Root>
    );
}

const Root = styled("div")`
    width: 100%;
    display: flex;
    align-items: center;
`;
