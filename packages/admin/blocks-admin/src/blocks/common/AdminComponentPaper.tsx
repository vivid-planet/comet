import { Box, Paper } from "@mui/material";
import { createContext, PropsWithChildren, useContext } from "react";

const AdminComponentPaperContext = createContext<boolean>(false);

export function useAdminComponentPaper(): boolean {
    return useContext(AdminComponentPaperContext);
}

interface Props {
    disablePadding?: boolean;
}

export const AdminComponentPaper = ({ children, disablePadding }: PropsWithChildren<Props>) => {
    const hasBackground = useContext(AdminComponentPaperContext);

    if (hasBackground) {
        return <Box padding={disablePadding ? 0 : 3}>{children}</Box>;
    } else {
        return (
            <AdminComponentPaperContext.Provider value={true}>
                <Paper variant="outlined">
                    <Box padding={disablePadding ? 0 : 3}>{children}</Box>
                </Paper>
            </AdminComponentPaperContext.Provider>
        );
    }
};
