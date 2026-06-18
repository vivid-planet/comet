import { Chip, type ChipProps } from "@mui/material";
import { styled } from "@mui/material/styles";

type ActionLogTypeChipProps = ChipProps & { actionLogType: string };

export const ActionLogTypeChip = styled(({ actionLogType, ...rest }: ActionLogTypeChipProps) => <Chip {...rest} />, {
    shouldForwardProp: (prop) => prop !== "actionLogType",
})(({ theme, actionLogType }) => {
    if (actionLogType === "Created") {
        return { backgroundColor: theme.palette.success.main, color: theme.palette.success.contrastText };
    }
    if (actionLogType === "Updated") {
        return { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText };
    }
    if (actionLogType === "Deleted") {
        return { backgroundColor: theme.palette.error.main, color: theme.palette.error.contrastText };
    }
    return {};
});
