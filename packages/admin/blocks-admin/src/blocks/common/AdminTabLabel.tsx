import { Warning } from "@comet/admin-icons";
import { styled } from "@mui/material/styles";
import { PropsWithChildren } from "react";

import { usePromise } from "../../common/usePromise";

interface AdminTabLabelProps {
    isValid?: () => Promise<boolean> | boolean;
}

export function AdminTabLabel({ children, isValid: isValidFn }: PropsWithChildren<AdminTabLabelProps>) {
    const isValid = usePromise(isValidFn, { initialValue: true });

    return (
        <Root>
            {!isValid && <Warning color="error" />}
            {children}
        </Root>
    );
}

const Root = styled("span")``;
