import { styled } from "@mui/material/styles";
import React from "react";
import { FormattedDate } from "react-intl";

export const DateTime = () => {
    const [currentTime, setCurrentTime] = React.useState<Date>(new Date());

    React.useEffect(() => {
        const intervalHandle = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intervalHandle);
        };
    }, []);

    return (
        <Root>
            <DateContainer>
                <FormattedDate value={currentTime} dateStyle="full" />
            </DateContainer>
            <TimeContainer>
                <FormattedDate value={currentTime} hour="2-digit" minute="2-digit" />
            </TimeContainer>
        </Root>
    );
};

const Root = styled("div")`
    position: absolute;
    top: ${({ theme }) => theme.spacing(4)};
    right: ${({ theme }) => theme.spacing(8)};
    font-weight: 200;
    text-align: right;
`;

const DateContainer = styled("div")`
    font-size: 33px;
    line-height: 39px;
`;

const TimeContainer = styled("div")`
    font-size: 55px;
    line-height: 64px;
`;
