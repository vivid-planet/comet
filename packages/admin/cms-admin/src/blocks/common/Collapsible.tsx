<<<<<<< HEAD:packages/admin/cms-admin/src/blocks/common/Collapsible.tsx
import { Button, Collapse } from "@mui/material";
import { type PropsWithChildren, type ReactNode } from "react";
=======
import { Button } from "@comet/admin";
import { Collapse } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
>>>>>>> main:packages/admin/blocks-admin/src/common/Collapsible.tsx

interface CollapsibleProps {
    open: boolean;
    header: ReactNode;
    onChange: (open: boolean) => void;
}

export const Collapsible = ({ header, children, open, onChange }: PropsWithChildren<CollapsibleProps>) => {
    return (
        <>
            <Button
                fullWidth={true}
                onClick={() => {
                    onChange(!open);
                }}
                variant="textDark"
            >
                {header}
            </Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
    );
};
