import { Edit, Warning } from "@comet/admin-icons";
import { Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import * as React from "react";

import { usePromise } from "../../common/usePromise";
import { AdminComponentPaper } from "./AdminComponentPaper";

interface Props {
    displayName: React.ReactNode;
    preview: React.ReactNode;
    count?: number;
    onClick?: React.MouseEventHandler<HTMLElement>;
    isValid?: () => Promise<boolean> | boolean;
}

export function AdminComponentNestedButton({ displayName, preview, count, onClick, isValid: isValidFn }: Props): React.ReactElement {
    const isValid = usePromise(isValidFn, { initialValue: true });

    return (
        <AdminComponentPaper disablePadding>
            <Button onClick={onClick} fullWidth endIcon={<Edit />} color="info">
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
}

const TextContainer = styled("span")`
    min-width: 0;
    flex: 1;
`;
