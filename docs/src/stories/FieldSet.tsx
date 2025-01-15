import { FieldSet } from "@comet/admin";
import { Info } from "@comet/admin-icons";
import { Chip, IconButton, Typography } from "@mui/material";

function Story() {
    return (
        <>
            {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
            <Typography variant="h4">Collapsible FieldSet initially collapsed</Typography>
            <FieldSet
                title={
                    <>
                        TITLE WITH ICON
                        {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                        <IconButton>
                            {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
                            <Info />
                        </IconButton>
                    </>
                }
                supportText="Support text"
                /* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */
                endAdornment={<Chip color="default" label="Chip text" />}
                initiallyExpanded={false}
            >
                <div>Content goes here ...</div>
            </FieldSet>
            {/* @ts-expect-error type mismatch between React 17 and 18, will be fixed by updating the admin packages */}
            <Typography variant="h4">Non-collapsible FieldSet with disabled padding</Typography>
            <FieldSet title="TITLE" supportText="Support text" endAdornment="Info text" collapsible={false} disablePadding>
                <div>Full-Width-Content goes here ...</div>
            </FieldSet>
        </>
    );
}

export default Story;
