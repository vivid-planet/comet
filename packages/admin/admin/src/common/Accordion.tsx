import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import * as React from "react";

interface AccordionProps {
    title: React.ReactNode;
    supportText?: React.ReactNode;
    endAdornment?: React.ReactNode;
    initialExpanded?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({ title, supportText, endAdornment, children, initialExpanded = false }) => {
    const [expanded, setExpanded] = React.useState(initialExpanded);

    const handleChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
    };

    return (
        <AccordionComponent expanded={expanded} onChange={handleChange} disableGutters elevation={0} square>
            <AccordionSummary>
                <AccordionColumn>
                    <AccordionTitleText expanded={expanded}>{title}</AccordionTitleText>
                    <AccordionSupportText>{supportText}</AccordionSupportText>
                </AccordionColumn>
                <FillSpace />
                <AccordionEndAdornment>{endAdornment}</AccordionEndAdornment>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </AccordionComponent>
    );
};

const AccordionComponent = styled(MuiAccordion)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": {
        marginBottom: "20px",
    },
    "&:before": {
        display: "none",
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon />} {...props} />)`
    display: flex;
    flex-direction: row-reverse;
    padding: 0 20px;
    gap: 20px;
    height: 86px;
`;

const AccordionEndAdornment = styled(MuiAccordionSummary)`
    align-items: center;
`;

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: "40px",
    borderTop: `1px solid ${theme.palette.divider}`,
}));

const AccordionColumn = styled(MuiAccordionDetails)`
    flex-direction: column;
    padding: 10px;
`;

const FillSpace = styled("div")`
    flex-grow: 1;
    box-sizing: inherit;
    user-select: none;
`;

interface AccordionTitleTextProps {
    expanded: boolean;
}

const AccordionTitleText = styled("div")<AccordionTitleTextProps>`
    font-weight: ${({ theme }) => theme.typography.fontWeightMedium};
    font-size: 16px;
    line-height: 16px;
    text-transform: uppercase;
    color: ${({ expanded, theme }) => (expanded ? theme.palette.primary.main : theme.palette.text.primary)};
`;

const AccordionSupportText = styled("div")`
    font-size: 12px;
    line-height: 18px;
    color: ${({ theme }) => theme.palette.text.secondary};
`;
