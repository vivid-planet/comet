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
    const childrenElements = children
        .filter(c => {
            const Comp = c;
            return Comp(rest) !== null; // filter out unused control components
        })
        .map(c => {
            const Comp = c;
            return React.createElement(Comp, rest);
        });

    return (
        <div>
            {childrenElements.map((c, idx) => {
                return (
                    <ToolbarSlot key={idx} isLast={idx + 1 === childrenElements.length}>
                        {c}
                    </ToolbarSlot>
                );
            })}
        </div>
    );
}
