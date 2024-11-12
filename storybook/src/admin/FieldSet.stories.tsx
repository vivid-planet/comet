import { FieldSet, Tooltip } from "@comet/admin";
import { Info } from "@comet/admin-icons";
import { Chip, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const textContent =
    "FieldSet content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

export default {
    title: "@comet/admin/FieldSet",
};

export const _FieldSet = {
    render: () => (
        <Stack spacing={4}>
            <FieldSet title="FieldSet Title" supportText="Support text">
                {textContent}
            </FieldSet>

            <FieldSet
                title={
                    <>
                        FieldSet with an icon
                        <Tooltip title="Lorem ipsum info." sx={{ ml: 1 }}>
                            <Info />
                        </Tooltip>
                    </>
                }
            >
                {textContent}
            </FieldSet>

            <FieldSet title="FieldSet closed by default" initiallyExpanded={false}>
                {textContent}
            </FieldSet>

            <FieldSet title="FieldSet with a chip" endAdornment={<Chip color="default" label="Chip text" />}>
                {textContent}
            </FieldSet>

            <FieldSet title="FieldSet with full-width content" disablePadding>
                <Box sx={({ palette }) => ({ p: 4, background: palette.primary.light })}>{textContent}</Box>
            </FieldSet>

            <FieldSet title="FieldSet not collapsible" collapsible={false}>
                {textContent}
            </FieldSet>
        </Stack>
    ),

    name: "FieldSet",
};
