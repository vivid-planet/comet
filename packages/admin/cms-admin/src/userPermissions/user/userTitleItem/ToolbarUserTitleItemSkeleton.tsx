import { Box, Skeleton } from "@mui/material";
import { type FunctionComponent } from "react";

export const ToolbarUserTitleItemSkeleton: FunctionComponent = () => {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box>
                <Skeleton variant="text" width={200} />
                <Skeleton variant="text" width={150} height={16} />
            </Box>
        </Box>
    );
};
