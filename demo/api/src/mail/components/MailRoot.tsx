import { Mjml, MjmlAttributes, MjmlBody, MjmlHead, MjmlSection, MjmlText } from "@faire/mjml-react";
import { type PropsWithChildren } from "react";

export const MailRoot = ({ children }: PropsWithChildren) => {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlAttributes>
                    <MjmlText padding={0} fontFamily="Arial, sans-serif" />
                    <MjmlSection padding={0} />
                </MjmlAttributes>
            </MjmlHead>
            <MjmlBody width={600} backgroundColor="#F2F2F2">
                {children}
            </MjmlBody>
        </Mjml>
    );
};
