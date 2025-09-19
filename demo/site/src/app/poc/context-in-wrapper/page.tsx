import "./global.scss";

import { Header } from "../Header";
import { BackgroundBlock } from "./BackgroundBlock";
import { TextBlock } from "./TextBlock";

export default function PocContextPage() {
    return (
        <div>
            <Header
                title="POC: Using a context in a wrapper"
                description="The theme-mode is stores in a context, uses the `BlockRoot` client-component to apply the theme-mode as a class-name."
                infos={[
                    "✅ You're not forced to use CSS-variables for all theme-dependant colors",
                    "✅ All component specific code is in one block (you only need to look at or edit one scss file)",
                    "✅ It's less likely you'll forget to remove unused CSS-variables -> more concise code",
                    "✅ Only one additional modifier-class is needed -> more concise code, more 'native' css",
                    "✅ No ugly global selector in component-blocks",
                    "❌ Requires BlockRoot as the root for every component",
                    "🤔 The block is not hydrated but the `BlockRoot` is (likely only a tiny performance hit)",
                ]}
            />

            <BackgroundBlock mode="inverted">
                <TextBlock text="First inverted" />
            </BackgroundBlock>

            <BackgroundBlock mode="default">
                <TextBlock text="Default - directly in Root" />

                <div>
                    <BackgroundBlock mode="inverted">
                        <TextBlock text="Inverted - nested in Default" />
                        <div>
                            <div>
                                <TextBlock text="Inverted - nested in Default (more divs)" />
                            </div>
                        </div>

                        <BackgroundBlock mode="default">
                            <TextBlock text="Default - nested in three levels" />
                            <div>
                                <div>
                                    <TextBlock text="Default - nested in three levels (more divs)" />
                                </div>
                            </div>

                            <BackgroundBlock mode="inverted">
                                <TextBlock text="Inverted - nested in four levels" />

                                <BackgroundBlock mode="inverted">
                                    <TextBlock text="Inverted - nested in five levels" />
                                </BackgroundBlock>

                                <BackgroundBlock mode="default">
                                    <TextBlock text="Default - nested in five levels" />
                                </BackgroundBlock>
                            </BackgroundBlock>

                            <BackgroundBlock mode="default">
                                <TextBlock text="Default - nested in four levels" />

                                <BackgroundBlock mode="inverted">
                                    <TextBlock text="Inverted - nested in five levels" />
                                </BackgroundBlock>

                                <BackgroundBlock mode="default">
                                    <TextBlock text="Default - nested in five levels" />
                                </BackgroundBlock>
                            </BackgroundBlock>
                        </BackgroundBlock>
                    </BackgroundBlock>
                </div>
            </BackgroundBlock>

            <BackgroundBlock mode="inverted">
                <TextBlock text="Inverted - directly in Root" />

                <BackgroundBlock mode="default">
                    <TextBlock text="Default - nested in Inverted" />

                    <BackgroundBlock mode="inverted">
                        <TextBlock text="Inverted - nested in three levels" />

                        <BackgroundBlock mode="default">
                            <TextBlock text="Default - nested in four levels" />

                            <BackgroundBlock mode="inverted">
                                <TextBlock text="Inverted - nested in five levels" />

                                <BackgroundBlock mode="default">
                                    <TextBlock text="Default - nested in six levels" />
                                </BackgroundBlock>
                            </BackgroundBlock>
                        </BackgroundBlock>

                        <BackgroundBlock mode="inverted">
                            <TextBlock text="Inverted - nested in four levels" />

                            <BackgroundBlock mode="default">
                                <TextBlock text="Default - nested in five levels" />
                            </BackgroundBlock>

                            <BackgroundBlock mode="inverted">
                                <TextBlock text="Inverted - nested in five levels" />
                            </BackgroundBlock>
                        </BackgroundBlock>
                    </BackgroundBlock>
                </BackgroundBlock>
            </BackgroundBlock>
        </div>
    );
}
