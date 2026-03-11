import { recaptchaClient, recaptchaResourceName } from "./recaptchaClient";

interface Props {
    token: string;
    action: "form_submit";
    minimalRiskAnalysisScore?: number;
}

export const assessRecaptchaToken = async ({ token, action, minimalRiskAnalysisScore = 0.5 }: Props): Promise<boolean> => {
    const [assessment] = await recaptchaClient.createAssessment({
        assessment: {
            event: {
                token,
                siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            },
        },
        parent: recaptchaResourceName,
    });
    if (!assessment.tokenProperties?.valid) {
        return false;
    }
    if (assessment.tokenProperties.action === action) {
        return assessment.riskAnalysis?.score != null && assessment.riskAnalysis.score > minimalRiskAnalysisScore;
    } else {
        return false;
    }
};
