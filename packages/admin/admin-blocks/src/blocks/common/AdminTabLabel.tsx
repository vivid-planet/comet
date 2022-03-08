import { Warning } from "@comet/admin-icons";
import * as React from "react";
import styled from "styled-components";

import { usePromise } from "../../common/usePromise";
export interface AdminTabLabelProps {
    children: React.ReactNode;
    isValid?: () => Promise<boolean> | boolean;
}

export function AdminTabLabel({ children, isValid: isValidFn }: AdminTabLabelProps): JSX.Element | null {
    const isValid = usePromise(isValidFn, { initialValue: true });

    return (
        <Root>
            {!isValid && <Warning color="error" />}
            {children}
        </Root>
    );
}

const Root = styled.span``;
