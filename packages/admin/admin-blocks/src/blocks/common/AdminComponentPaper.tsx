import { Box, Paper } from "@material-ui/core";
import * as React from "react";

const AdminComponentPaperContext = React.createContext<boolean>(false);

export function useAdminComponentPaper(): boolean {
    return React.useContext(AdminComponentPaperContext);
}

interface Props {
    children?: React.ReactNode;
    disablePadding?: boolean;
}

export function AdminComponentPaper({ children, disablePadding }: Props): React.ReactElement {
    const hasBackground = React.useContext(AdminComponentPaperContext);

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
}
