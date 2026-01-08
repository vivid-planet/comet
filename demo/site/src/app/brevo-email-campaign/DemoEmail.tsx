import {
    Mjml,
    MjmlAll,
    MjmlAttributes,
    MjmlBody,
    MjmlButton,
    MjmlColumn,
    MjmlHead,
    MjmlPreview,
    MjmlSection,
    MjmlText,
    MjmlTitle,
} from "@faire/mjml-react";
import { FormattedMessage, IntlProvider } from "react-intl";

export function DemoEmail({ name }: { name: string }) {
    return (
        <Mjml>
            <IntlProvider locale="en" messages={{}}>
                <MjmlHead>
                    <MjmlTitle>Welcome</MjmlTitle>
                    <MjmlPreview>Welcome to Vivid</MjmlPreview>

                    <MjmlAttributes>
                        <MjmlAll fontFamily="Inter, Arial, sans-serif" fontSize="16px" lineHeight="24px" />
                    </MjmlAttributes>
                </MjmlHead>

                <MjmlBody width={600}>
                    <MjmlSection>
                        <MjmlColumn>
                            <MjmlText fontSize="20px" fontWeight="700">
                                Hi {name},
                            </MjmlText>

                            <MjmlText>This is a minimal MJML email rendered from React and compiled to HTML on the server.</MjmlText>

                            <MjmlText>
                                <FormattedMessage id="test" defaultMessage="My test" />
                            </MjmlText>

                            <MjmlButton href="https://example.com">Open</MjmlButton>
                        </MjmlColumn>
                    </MjmlSection>
                </MjmlBody>
            </IntlProvider>
        </Mjml>
    );
}
