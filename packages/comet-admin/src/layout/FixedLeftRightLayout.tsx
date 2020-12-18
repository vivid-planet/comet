import * as React from "react";

const Left: React.SFC<any> = (props) => props.children;
const Right: React.SFC<any> = (props) => props.children;
Left.displayName = "FixedLeftRightLayout.Left";
Right.displayName = "FixedLeftRightLayout.Right";

interface IProps {
    children: any[]; // Array<Left | Right>;
}
export class FixedLeftRightLayout extends React.Component<IProps> {
    public static Left = Left;
    public static Right = Right;

    public render() {
        return (
            <div
                style={{
                    display: "grid",
                    gridTemplate: '"table detail"',
                    gridTemplateColumns: "1fr 4fr", // TODO make width configurable
                    gridTemplateRows: "1fr",
                    gridGap: "0px",
                    minHeight: "100vh",
                }}
            >
                <div style={{ borderRight: "1px solid rgba(224, 224, 224, 1)", gridArea: "table" }}>
                    {React.Children.map(this.props.children, (child: React.ReactElement<any>) => (child.type === Left ? child : null))}
                </div>
                <div style={{ gridArea: "detail" }}>
                    {React.Children.map(this.props.children, (child: React.ReactElement<any>) => (child.type === Right ? child : null))}
                </div>
            </div>
        );
    }
}
