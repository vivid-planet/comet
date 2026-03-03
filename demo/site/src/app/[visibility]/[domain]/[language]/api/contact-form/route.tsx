import { assessRecaptchaToken } from "@src/common/api/assessRecaptchaToken";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const queryValidationSchema = z.object({
    name: z.string(),
    company: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string(),
    message: z.string(),
    privacyConsent: z.boolean(),
    reCaptchaToken: z.string(),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validationResult = queryValidationSchema.safeParse(body);

    if (!validationResult.success) {
        return NextResponse.json(
            {
                cause: validationResult.error,
                message: "Validation failed",
            },
            {
                status: 400,
            },
        );
    }

    if (!process.env.NEXT_PUBLIC_RECAPTCHA_KEY) {
        return NextResponse.json({ error: "ReCAPTCHA key is not set" }, { status: 500 });
    }

    const recaptchaTokenValid = await assessRecaptchaToken({
        token: validationResult.data.reCaptchaToken,
        action: "form_submit",
        recaptchaKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
    });

    if (!recaptchaTokenValid) {
        return NextResponse.json({
            success: false,
            error: "ReCAPTCHA assessment failed",
        });
    }

    try {
        return NextResponse.json(
            { success: true },
            {
                status: 200,
            },
        );
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Something went wrong processing the contact form" }, { status: 500 });
    }
}
