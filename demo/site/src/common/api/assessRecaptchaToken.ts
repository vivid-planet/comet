import { createRecaptchaClient } from "./createRecaptchaClient";

interface Props {
    token: string;
    action: "form_submit";
    recaptchaKey: string;
}

export const assessRecaptchaToken = async ({ token, action, recaptchaKey }: Props): Promise<boolean> => {
    const { recaptchaClient, recaptchaResourceName } = createRecaptchaClient();
    const [assessment] = await recaptchaClient.createAssessment({
        assessment: {
            event: {
                token,
                siteKey: recaptchaKey,
            },
        },
        parent: recaptchaResourceName,
    });
    if (!assessment.tokenProperties?.valid) {
        return false;
    }
    if (assessment.tokenProperties.action === action) {
        return assessment.riskAnalysis?.score != null && assessment.riskAnalysis.score > 0.6;
    } else {
        return false;
    }
};
