import { createStyles } from "@mui/styles";

export type UnsavedChangesMessageClassKey = "root" | "warningIcon" | "text";

export const styles = () => {
    return createStyles<UnsavedChangesMessageClassKey, Record<string, never>>({
        root: {
            display: "flex",
        },
        warningIcon: { fontSize: 20 },
        text: { paddingLeft: 10 },
    });
};
