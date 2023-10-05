import { FieldSet } from "@comet/admin";
import { Info } from "@mui/icons-material";
import { Chip, IconButton, Typography } from "@mui/material";
import * as React from "react";

function Story() {
    return (
        <>
            <Typography variant="h4">Collapsible FieldSet initial collapsed</Typography>
            <FieldSet
                title={
                    <>
                        TITLE WITH ICON
                        <IconButton>
                            <Info />
                        </IconButton>
                    </>
                }
                supportText="Support text"
                endAdornment={<Chip color="default" label="Chip text" />}
                initialCollapsed
            >
                <div>Content goes here ...</div>
            </FieldSet>
            <Typography variant="h4">Non-collapsible FieldSet with disabled padding</Typography>
            <FieldSet title="TITLE" supportText="Support text" endAdornment="Info text" collapsible={false} disablePadding>
                <div>Full-Width-Content goes here ...</div>
            </FieldSet>
        </>
    );
}

export default Story;
