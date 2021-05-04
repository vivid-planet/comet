import { makeStyles } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import * as React from "react";

const Left = (props: any): React.ReactElement => props.children;
const Right = (props: any): React.ReactElement => props.children;

Left.displayName = "FixedLeftRightLayout.Left";
Right.displayName = "FixedLeftRightLayout.Right";

interface IProps {
    children: any[]; // Array<Left | Right>;
}

export type CometAdminFixedLeftRightLayoutKeys = "root" | "left" | "right";

function FixedLeftRightLayout({ children }: IProps): React.ReactElement {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.left}>
                {React.Children.map(children, (child: React.ReactElement<any>) => (child.type === Left ? child : null))}
            </div>
            <div className={classes.right}>
                {React.Children.map(children, (child: React.ReactElement<any>) => (child.type === Right ? child : null))}
            </div>
        </div>
    );
}

FixedLeftRightLayout.Left = Left;
FixedLeftRightLayout.Right = Right;

const useStyles = makeStyles<Theme, {}, CometAdminFixedLeftRightLayoutKeys>(
    (theme: Theme) => ({
        root: {
            display: "grid",
            gridTemplate: '"table detail"',
            gridTemplateColumns: "1fr 4fr",
            gridTemplateRows: "1fr",
            gridGap: "0px",
            minHeight: "100vh",
        },
        left: {
            borderRight: `1px solid ${theme.palette.grey[100]}`,
            gridArea: "table",
        },
        right: {
            gridArea: "detail",
        },
    }),
    { name: "CometAdminFixedLeftRightLayout" },
);

export { FixedLeftRightLayout };
