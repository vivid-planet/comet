import { Alert } from "@dextinity/admin";
import { css, styled } from "@mui/material/styles";
import { useField } from "react-final-form";
import { FormattedMessage } from "react-intl";

export const FutureProductNotice = () => {
    const availableSinceField = useField("availableSince");
    const dateValue = availableSinceField.input.value ? new Date(availableSinceField.input.value) : null;
    const today = new Date();
    const willBeAvailableInTheFuture = dateValue && dateValue > today;

    if (willBeAvailableInTheFuture) {
        return (
            <FutureProductAlert
                severity="warning"
                title={
                    <FormattedMessage
                        id="product.futureProductNotice"
                        defaultMessage="This product will not be visible to the public until the selected date."
                    />
                }
            />
        );
    }

    return null;
};

const FutureProductAlert = styled(Alert)(
    ({ theme }) => css`
        margin-bottom: ${theme.spacing(4)};
    `,
);
