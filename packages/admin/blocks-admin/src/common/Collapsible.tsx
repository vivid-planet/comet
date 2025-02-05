import { Button, Collapse } from "@mui/material";
import { type PropsWithChildren, type ReactNode } from "react";

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
                color="info"
            >
                {header}
            </Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {children}
            </Collapse>
        </>
    );
};
