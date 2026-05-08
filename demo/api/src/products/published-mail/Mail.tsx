import { MjmlColumn, MjmlSection, MjmlSpacer, MjmlText, ThemeProvider } from "@comet/mail-react";
import { FormattedMessage } from "react-intl";

import { theme } from "./theme";

export type MailProps = {
    recipient: { name: string; email: string; language: string };
    countProductPublished: "all" | number;
};

// TODO: Use `MjmlMailRoot` instead of `ThemeProvider` and `MailRoot` - once background color is supported throught theme/MjmlMailRoot
export const Mail = ({ recipient, countProductPublished }: MailProps) => {
    return (
        <ThemeProvider theme={theme}>
            <MjmlSection backgroundColor="#FFFFFF">
                <MjmlColumn>
                    <MjmlSpacer height="20px" />
                </MjmlColumn>
            </MjmlSection>
            <MjmlSection backgroundColor="#FFFFFF" paddingLeft="20px" paddingRight="20px">
                <MjmlColumn>
                    <MjmlText variant="heading" bottomSpacing>
                        <FormattedMessage
                            id="productPublishedMail.salutation"
                            defaultMessage="Hello {recipientName}"
                            values={{ recipientName: recipient.name }}
                        />
                    </MjmlText>
                </MjmlColumn>
            </MjmlSection>
            <MjmlSection backgroundColor="#FFFFFF" paddingLeft="20px" paddingRight="20px">
                <MjmlColumn>
                    <MjmlText>
                        <FormattedMessage
                            id="productPublishedMail.text"
                            defaultMessage="{numberOfProductsPublished, select, all {All products} 1 {A product has} other {{numberOfProductsPublished} products have}} been published."
                            values={{ numberOfProductsPublished: countProductPublished }}
                        />
                    </MjmlText>
                </MjmlColumn>
            </MjmlSection>
            <MjmlSection backgroundColor="#FFFFFF">
                <MjmlColumn>
                    <MjmlSpacer height="20px" />
                </MjmlColumn>
            </MjmlSection>
        </ThemeProvider>
    );
};
