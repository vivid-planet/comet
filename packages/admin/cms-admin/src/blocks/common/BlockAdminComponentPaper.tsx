import { Box, Paper } from "@mui/material";
import { createContext, PropsWithChildren, useContext } from "react";

const BlockAdminComponentPaperContext = createContext<boolean>(false);

export function useBlockAdminComponentPaper(): boolean {
    return useContext(BlockAdminComponentPaperContext);
}

interface Props {
    disablePadding?: boolean;
}

export const BlockAdminComponentPaper = ({ children, disablePadding }: PropsWithChildren<Props>) => {
    const hasBackground = useContext(BlockAdminComponentPaperContext);

    if (hasBackground) {
        return <Box padding={disablePadding ? 0 : 3}>{children}</Box>;
    } else {
        return (
            <BlockAdminComponentPaperContext.Provider value={true}>
                <Paper variant="outlined">
                    <Box padding={disablePadding ? 0 : 3}>{children}</Box>
                </Paper>
            </BlockAdminComponentPaperContext.Provider>
        );
    }
};
