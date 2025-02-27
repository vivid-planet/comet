import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { FormattedDate } from "react-intl";

export const DateTime = () => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
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
    top: 16px;
    right: ${({ theme }) => theme.spacing(4)};
    text-align: right;

    ${({ theme }) => theme.breakpoints.up("sm")} {
        top: ${({ theme }) => theme.spacing(4)};
        right: ${({ theme }) => theme.spacing(8)};
    }
`;

const DateContainer = styled("div")`
    font-size: 24px;
    line-height: 28px;
    font-weight: 150;

    ${({ theme }) => theme.breakpoints.up("sm")} {
        font-size: 33px;
        line-height: 39px;
    }
`;

const TimeContainer = styled("div")`
    font-size: 36px;
    line-height: 42px;
    font-weight: 170;

    ${({ theme }) => theme.breakpoints.up("sm")} {
        font-size: 55px;
        line-height: 64px;
    }
`;
