import { Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { IProps } from "./TableQuery";

export type TableQueryClassKey = "root" | "loadingContainer" | "loadingPaper";

export const styles = ({ zIndex }: Theme) => {
    return createStyles<TableQueryClassKey, IProps>({
        root: {
            position: "relative",
        },
        loadingContainer: {
            position: "sticky",
            top: 0,
            width: "100%",
            zIndex: zIndex.modal,
            transform: "translate(50%, 200px)",
        },
        loadingPaper: {
            display: "flex",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
            height: 100,
            width: 100,
        },
    });
};
