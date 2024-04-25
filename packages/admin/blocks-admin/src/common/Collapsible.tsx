import { Button, Collapse } from "@mui/material";
import React, { FunctionComponent } from "react";

interface CollapsibleProps {
    open: boolean;
    header: React.ReactNode;
    onChange: (open: boolean) => void;
}

export const Collapsible: FunctionComponent<CollapsibleProps> = ({ header, children, open, onChange }) => {
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
