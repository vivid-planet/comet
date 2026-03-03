import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

export function createRecaptchaClient() {
    if (process.env.RECAPTCHA_SECRET_KEY === undefined) {
        throw new Error("Missing RECAPTCHA_SECRET_KEY environment variable");
    }
    const serviceAccountObject = JSON.parse(Buffer.from(process.env.RECAPTCHA_SECRET_KEY, "base64").toString("utf8"));
    const recaptchaClient = new RecaptchaEnterpriseServiceClient({
        credentials: serviceAccountObject,
    });
    const recaptchaResourceName = recaptchaClient.projectPath(serviceAccountObject.project_id);
    return { recaptchaClient, recaptchaResourceName };
}
