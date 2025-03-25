import { Button } from "@comet/admin";
import { Edit, Warning } from "@comet/admin-icons";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MouseEventHandler, ReactNode } from "react";

import { usePromise } from "../../common/usePromise";
import { AdminComponentPaper } from "./AdminComponentPaper";

interface Props {
    displayName: ReactNode;
    preview: ReactNode;
    count?: number;
    onClick?: MouseEventHandler<HTMLElement>;
    isValid?: () => Promise<boolean> | boolean;
}

export const AdminComponentNestedButton = ({ displayName, preview, count, onClick, isValid: isValidFn }: Props) => {
    const isValid = usePromise(isValidFn, { initialValue: true });

    return (
        <AdminComponentPaper disablePadding>
            <Button onClick={onClick} fullWidth endIcon={<Edit />} variant="textDark">
                <TextContainer>
                    <Typography variant="body1" align="left" noWrap>
                        {!isValid && <Warning color="error" />}
                        {displayName}
                        {count !== undefined && ` (${count})`}
                    </Typography>
                    <Typography variant="body2" align="left" color="textSecondary" noWrap>
                        {preview}
                    </Typography>
                </TextContainer>
            </Button>
        </AdminComponentPaper>
    );
};

const TextContainer = styled("span")`
    min-width: 0;
    flex: 1;
`;
