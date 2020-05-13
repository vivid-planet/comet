import * as React from "react";
import { IControlProps } from "../types";
import useRteTheme from "../useRteTheme";
import * as sc from "./Toolbar.sc";

interface IProps extends IControlProps {
    children: Array<(p: IControlProps) => JSX.Element | null>;
}

export default function Toolbar({ children, ...rest }: IProps) {
    const rteTheme = useRteTheme();

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
        <sc.Root colors={rteTheme.colors}>
            {childrenElements.map((c, idx) => {
                return (
                    <sc.ToolbarSlot colors={rteTheme.colors} key={idx}>
                        {c}
                    </sc.ToolbarSlot>
                );
            })}
        </sc.Root>
    );
}
