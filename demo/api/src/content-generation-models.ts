import { ContentGenerationRequest, Options } from "@comet/cms-api/lib/content-generation/content-generation.types";

export const ContentGenerationModels = ({ apiKey, apiUrl }: { apiKey: string; apiUrl: string }) => {
    const createMessages = (options: ContentGenerationRequest, imageDetail: "low" | "high") => {
        const messages = [];
        options.instructions && messages.push({ role: "system", content: options.instructions });
        options.context && messages.push({ role: "user", content: options.context });

        if (options.examples) {
            for (const example of options.examples) {
                messages.push({
                    role: example.role,
                    content: example.text,
                });
            }
        }

        if (options.image) {
            messages.push({
                role: "user",
                content: [
                    {
                        type: "image_url",
                        image_url: {
                            url: options.image.base64,
                            detail: imageDetail,
                        },
                    },
                ],
            });
        }

        options.prompt && messages.push({ role: "user", content: options.prompt });

        return messages;
    };

    function mapOptions(options?: Options) {
        if (!options) {
            return {};
        }
        return {
            seed: options.seed,
            temperature: options.temperature,
            max_tokens: options.maxTokens,
        };
    }

    const createRequest = (options: ContentGenerationRequest, imageDetail: "low" | "high", apiKey: string) => {
        const headers = new Headers();
        headers.append("api-key", apiKey);
        headers.append("Content-Type", "application/json");

        const body = JSON.stringify({
            messages: createMessages(options, imageDetail),
            ...mapOptions(options.options),
        });

        return {
            method: "POST",
            headers: headers,
            body: body,
        };
    };

    const convertResponse = async (response: Response) => {
        const content = await response.json();
        if (content.error) {
            throw new Error(`Content Generation Request request failed - ${content.error.message}`);
        }
        return content.choices[0].message.content;
    };

    return {
        image: async (options: ContentGenerationRequest) => {
            const response = await fetch(apiUrl, createRequest(options, "low", apiKey));
            return convertResponse(response);
        },
        imageAdvanced: async (options: ContentGenerationRequest) => {
            const response = await fetch(apiUrl, createRequest(options, "high", apiKey));
            return convertResponse(response);
        },
    };
};
