import { MjmlColumn, MjmlSection, MjmlSpacer, MjmlText } from "@faire/mjml-react";
import { MailRoot } from "@src/mail/components/MailRoot";
import { FormattedMessage } from "react-intl";

export type MailProps = {
    recipient: { name: string; email: string; language: string };
    countProductPublished: "all" | number;
};

export const Mail = ({ recipient, countProductPublished }: MailProps) => {
    return (
        <MailRoot locale={recipient.language}>
            <MjmlSection backgroundColor="#FFFFFF">
                <MjmlColumn>
                    <MjmlSpacer height="20px" />
                </MjmlColumn>
            </MjmlSection>
            <MjmlSection backgroundColor="#FFFFFF" paddingLeft="20px" paddingRight="20px">
                <MjmlColumn>
                    <MjmlText fontSize="33px" lineHeight="39px">
                        <FormattedMessage
                            id="productPublishedMail.salutation"
                            defaultMessage="Hello {recipientName}"
                            values={{ recipientName: recipient.name }}
                        />
                    </MjmlText>
                </MjmlColumn>
            </MjmlSection>
            <MjmlSection backgroundColor="#FFFFFF">
                <MjmlColumn>
                    <MjmlSpacer height="40px" />
                </MjmlColumn>
            </MjmlSection>
            <MjmlSection backgroundColor="#FFFFFF" paddingLeft="20px" paddingRight="20px">
                <MjmlColumn>
                    <MjmlText fontSize="16px" lineHeight="20px">
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
        </MailRoot>
    );
};
