import { AddNoCircle } from "@comet/admin-icons";
import { ButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";

const IconWrapper = styled("div")`
    && {
        padding: 4px;
        border-radius: 12px;
        background-color: #fff;
        border: 1px solid ${({ theme }) => theme.palette.divider};
        box-shadow: ${({ theme }) => theme.shadows[1]};
        font-size: 0; // Hides non-breaking-space after icon
    }
`;

const AddIcon = styled(AddNoCircle)``;

const Root = styled(ButtonBase)`
    position: relative;
    z-index: 11;

    &:hover {
        ${IconWrapper} {
            background-color: ${({ theme }) => theme.palette.primary.main};
            border-color: ${({ theme }) => theme.palette.primary.main};
        }

        ${AddIcon} {
            color: #fff;
        }
    }
`;

interface Props {
    onClick?: () => void;
}

// renders one ore two insert-buttons
export default function InsertInBetweenActionButton({ onClick }: Props) {
    return (
        <Root onClick={onClick}>
            <IconWrapper>
                <AddIcon />
            </IconWrapper>
        </Root>
    );
}
