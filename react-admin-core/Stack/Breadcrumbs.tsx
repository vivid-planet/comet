import { Typography } from "@material-ui/core";
import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Ul = styled.ul`
    list-style-type: none;
`;

const Li = styled.li`
    float: left;
    padding-right: 8px;
    & a {
        text-decoration: none;
        & :hover {
            text-decoration: underline;
        }
    }
    & a :after {
        content: " »";
    }
    &:last-child a :after {
        content: "";
    }
`;

interface IProps {
    breadcrumbs: Array<{
        id: string;
        title: string;
        url: string;
    }>;
}
class Breadcrumbs extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }
    public render() {
        return (
            <Ul>
                {this.props.breadcrumbs.map(crumb => (
                    <Li key={crumb.id}>
                        <Link to={crumb.url} replace={true}>
                            <Typography variant="subtitle1">{crumb.title}</Typography>
                        </Link>
                    </Li>
                ))}
            </Ul>
        );
    }
}

export default Breadcrumbs;
