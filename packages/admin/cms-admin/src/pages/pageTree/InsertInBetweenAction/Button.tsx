import { type IEditDialogApi } from "@comet/admin";
import { AddNoCircle } from "@comet/admin-icons";
import { ButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import { type MouseEvent } from "react";

import { serializeInitialValues } from "../../../form/serializeInitialValues";
import { type PageTreeNodePosition } from "../PageTreeService";

const IconWrapper = styled("div")`
    padding: 4px;
    border-radius: 12px;
    background-color: #fff;
    border: 1px solid ${({ theme }) => theme.palette.divider};
    box-shadow: ${({ theme }) => theme.shadows[1]};
    font-size: 0; // Hides non-breaking-space after icon
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
    editDialogApi: IEditDialogApi;
    position: PageTreeNodePosition;
    onMouseOverButton?: (event: MouseEvent<HTMLButtonElement>) => void;
    onMouseOutButton?: (event: MouseEvent<HTMLButtonElement>) => void;
}

// renders one ore two insert-buttons
export default function Button({ editDialogApi, position, onMouseOverButton, onMouseOutButton }: Props) {
    return (
        <Root
            onMouseOver={onMouseOverButton}
            onMouseOut={onMouseOutButton}
            onClick={() => {
                editDialogApi.openAddDialog(serializeInitialValues(position));
            }}
        >
            <IconWrapper>
                <AddIcon />
            </IconWrapper>
        </Root>
    );
}
