import * as React from "react";
import { IControlProps } from "../types";
import * as sc from "./Toolbar.sc";

interface IProps extends IControlProps {
    children: Array<(p: IControlProps) => JSX.Element | null>;
}

export default function Toolbar({ children, colors, ...rest }: IProps) {
    const childrenElements = children
        .filter(c => {
            const Comp = c;
            return Comp({ colors, ...rest }) !== null; // filter out unused control components
        })
        .map(c => {
            const Comp = c;
            return React.createElement(Comp, { colors, ...rest });
        });

    return (
        <sc.Root colors={colors}>
            {childrenElements.map((c, idx) => {
                return (
                    <sc.ToolbarSlot colors={colors} key={idx}>
                        {c}
                    </sc.ToolbarSlot>
                );
            })}
        </sc.Root>
    );
}
