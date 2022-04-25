import { orange, yellow } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import * as React from "react";

export type TextMatch = { start: number; end: number; focused: boolean };

export const MarkedMatches: React.FunctionComponent<{ text: string; matches: TextMatch[] }> = ({ text, matches }) => {
    if (matches.length === 0) {
        return <>{text}</>;
    }

    const textSegments: React.ReactNode[] = [text.substring(0, matches[0].start)];

    for (let i = 0; i < matches.length - 1; i++) {
        const match = matches[i];
        textSegments.push(<Mark focused={match.focused}>{text.substring(match.start, match.end + 1)}</Mark>);
        textSegments.push(text.substring(match.end + 1, matches[i + 1].start));
    }

    const lastMatch = matches[matches.length - 1];

    textSegments.push(<Mark focused={lastMatch.focused}>{text.substring(lastMatch.start, lastMatch.end + 1)}</Mark>);
    textSegments.push(text.substring(lastMatch.end + 1));

    return (
        <Text>
            {textSegments.map((segment, index) => (
                <React.Fragment key={index}>{segment}</React.Fragment>
            ))}
        </Text>
    );
};

const Text = styled("span")`
    white-space: pre-wrap;
`;

const Mark = styled("mark")<{ focused: boolean }>`
    color: ${({ theme }) => theme.palette.common.black};
    background-color: ${({ focused }) => (focused ? orange[500] : yellow[500])};
`;
