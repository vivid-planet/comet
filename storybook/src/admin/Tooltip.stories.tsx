import { Tooltip } from "@comet/admin";
import { Add, Info, StatusErrorSolid, StatusSuccessSolid, StatusWarningSolid } from "@comet/admin-icons";
import { Stack } from "@mui/material";

export default {
    title: "@comet/admin/Tooltip",
};

export const IconWithTooltip = {
    render: () => {
        return (
            <Tooltip title="Add something">
                <Add />
            </Tooltip>
        );
    },

    name: "Icon with Tooltip",
};

export const StatusIndicators = {
    render: () => {
        return (
            <Stack py={5} spacing={5}>
                <Tooltip title="Success variant" placement="top-start" variant="success">
                    <StatusSuccessSolid color="success" />
                </Tooltip>
                <Tooltip title="Warning variant" placement="top-start" variant="warning">
                    <StatusWarningSolid color="warning" />
                </Tooltip>
                <Tooltip title="Error variant" placement="top-start" variant="error">
                    <StatusErrorSolid color="error" />
                </Tooltip>
            </Stack>
        );
    },
};

export const AllVariants = {
    render: () => {
        return (
            <Stack spacing={6}>
                <Tooltip title="Dark variant (default)" open placement="right">
                    <Info />
                </Tooltip>
                <Tooltip title="Light variant" open placement="right" variant="light">
                    <Info />
                </Tooltip>
                <Tooltip title="Neutral variant" open placement="right" variant="neutral">
                    <Info />
                </Tooltip>
                <Tooltip title="Primary variant" open placement="right" variant="primary">
                    <Info />
                </Tooltip>
                <Tooltip title="Error variant" open placement="right" variant="error">
                    <Info />
                </Tooltip>
                <Tooltip title="Success variant" open placement="right" variant="success">
                    <Info />
                </Tooltip>
                <Tooltip title="Warning variant" open placement="right" variant="warning">
                    <Info />
                </Tooltip>
            </Stack>
        );
    },
};
