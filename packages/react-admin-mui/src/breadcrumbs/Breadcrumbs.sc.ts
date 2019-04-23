import { Typography } from "@material-ui/core";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import { styled } from "../styled-components";

export const Root = styled.div`
    padding-top: 30px;
    padding-bottom: 30px;
`;

export const Title = styled(Typography)`
    && {
        font-size: 13px;
        line-height: 24px;
    }
`;

export const LinkWrapper = styled.div`
    display: inline-block;
    vertical-align: middle;
`;

export const ArrowIcon = styled(KeyboardArrowRight)`
    display: inline-block;
    vertical-align: middle;
    margin-left: 8px;
    margin-right: 8px;
`;
