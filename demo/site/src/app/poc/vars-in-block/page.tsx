import "./global.scss";

import { Header } from "../Header";
import { BackgroundBlock } from "./BackgroundBlock";
import { TextBlock } from "./TextBlock";

export default function PocOnePage() {
    return (
        <div>
            <Header
                title="POC: Component defines it's custom variables"
                description="The theme-mode is set as a class-name which the children Blocks use to define global CSS-Variables for themselfes."
                infos={[
                    "✅ Better preformance - doesn't need `use client`",
                    "✅ All component specific code is in one block (you only need to look at or edit one scss file)",
                    "✅ It's less likely you'll forget to remove unused variables -> more concise code",
                    "✅ Theme-dependant colors and non-theme-dependant colors are in one place -> less thinking about where to define a color",
                    "❌ Requires a ugly/hacky global selector in each components `module.scss`",
                    "❌ You're always forced to use CSS-variables for theme-dependant colors",
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
