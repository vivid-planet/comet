import { type IMjmlGroupProps, type IMjmlSectionProps, MjmlGroup, MjmlSection as BaseMjmlSection } from "@faire/mjml-react";
import type { ReactNode } from "react";

export type MjmlSectionProps = IMjmlSectionProps & {
    disableResponsiveBehavior?: boolean;
    slotProps?: {
        group?: Partial<IMjmlGroupProps>;
    };
};

export function MjmlSection({ children, disableResponsiveBehavior, slotProps, ...props }: MjmlSectionProps): ReactNode {
    return (
        <BaseMjmlSection {...props}>
            {disableResponsiveBehavior ? <MjmlGroup {...slotProps?.group}>{children}</MjmlGroup> : <>{children}</>}
        </BaseMjmlSection>
    );
}
