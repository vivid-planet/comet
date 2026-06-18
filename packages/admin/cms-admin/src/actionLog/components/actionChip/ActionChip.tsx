import { Chip, type ChipProps } from "@mui/material";
import { styled } from "@mui/material/styles";

type ActionChipProps = ChipProps & { actionValue: string };

export const ActionChip = styled(({ actionValue, ...rest }: ActionChipProps) => <Chip {...rest} />, {
    shouldForwardProp: (prop) => prop !== "actionValue",
})(({ theme, actionValue }) => {
    if (actionValue === "Created") {
        return { backgroundColor: theme.palette.success.main, color: theme.palette.success.contrastText };
    }
    if (actionValue === "Updated") {
        return { backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText };
    }
    if (actionValue === "Deleted") {
        return { backgroundColor: theme.palette.error.main, color: theme.palette.error.contrastText };
    }
    return {};
});
