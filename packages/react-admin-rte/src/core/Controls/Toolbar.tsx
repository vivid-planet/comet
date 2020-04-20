import * as React from "react";
import { IControlProps } from "../types";

interface IProps extends IControlProps {
    children: Array<(p: IControlProps) => JSX.Element | null>;
}

function ToolbarSlot({ children, isLast }: { children: React.ReactNode; isLast?: boolean }) {
    return (
        <span>
            {children}
            {!isLast && <Seperator />}
        </span>
    );
}
function Seperator() {
    return <>|</>;
}

export default function Toolbar({ children, ...rest }: IProps) {
    return (
        <div>
            {children
                .filter(c => c)
                .map((c, idx) => {
                    const Comp = c;
                    return (
                        <ToolbarSlot key={idx} isLast={idx + 1 === children.length}>
                            <Comp {...rest} />
                        </ToolbarSlot>
                    );
                })}
        </div>
    );
}
