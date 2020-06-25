import * as React from "react";
import { IControlProps } from "../types";
import * as sc from "./Toolbar.sc";

interface IProps extends IControlProps {
    children: Array<(p: IControlProps) => JSX.Element | null>;
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
        <sc.Root>
            {childrenElements.map((c, idx) => {
                return <sc.ToolbarSlot key={idx}>{c}</sc.ToolbarSlot>;
            })}
        </sc.Root>
    );
}
