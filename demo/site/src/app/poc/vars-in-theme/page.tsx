import "./global.scss";

import { Header } from "../Header";
import { BackgroundBlock } from "./BackgroundBlock";
import { TextBlock } from "./TextBlock";

export default function PocTwoPage() {
    return (
        <div>
            <Header
                title="POC: Global theme defines component-specific variables"
                description="The component-specific colors are defined in a global theme, using a mixin, you can apply any of the themes."
                infos={[
                    "✅ Better preformance - doesn't need `use client`",
                    "✅ Good overview over all theme-dependant variables",
                    "✅ Variable names will be more consistent across the project",
                    "✅ No ugly global selector in component-blocks",
                    "❌ Component specific code is partially defined in a global file",
                    "❌ The theme file will be bloated with all of the block-colors",
                    "❌ There will likely be a lot of unused variables, as you don't immediately see which ones are used",
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
