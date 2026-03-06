import { recaptchaClient, recaptchaResourceName } from "./createRecaptchaClient";

interface Props {
    token: string;
    action: "form_submit";
    recaptchaKey: string;
    minimalRiskAnalysisScore?: number;
}

export const assessRecaptchaToken = async ({ token, action, recaptchaKey, minimalRiskAnalysisScore = 0.6 }: Props): Promise<boolean> => {
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
        return assessment.riskAnalysis?.score != null && assessment.riskAnalysis.score > minimalRiskAnalysisScore;
    } else {
        return false;
    }
};
