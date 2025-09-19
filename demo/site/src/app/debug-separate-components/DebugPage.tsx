import "./global.scss";

import { BackgroundBlock } from "./BackgroundBlock";
import { TextBlock } from "./TextBlock";

export const DebugPage = () => {
    return (
        <div>
            <h1>Debug: Separated Components</h1>

            <TextBlock text="Directly in Root" works="yes" />

            <BackgroundBlock mode="default">
                <TextBlock text="Default - directly in Root" works="yes" />

                <BackgroundBlock mode="inverted">
                    <TextBlock text="Inverted - nested in Default" works="yes" />

                    <BackgroundBlock mode="default">
                        <TextBlock text="Default - nested in three levels" works="yes" />

                        <BackgroundBlock mode="inverted">
                            <TextBlock text="Inverted - nested in four levels" works="yes" />

                            <BackgroundBlock mode="inverted">
                                <TextBlock text="Inverted - nested in five levels" works="yes" />
                            </BackgroundBlock>

                            <BackgroundBlock mode="default">
                                <TextBlock text="Default - nested in five levels" works="yes" />
                            </BackgroundBlock>
                        </BackgroundBlock>

                        <BackgroundBlock mode="default">
                            <TextBlock text="Default - nested in four levels" works="yes" />

                            <BackgroundBlock mode="inverted">
                                <TextBlock text="Inverted - nested in five levels" works="yes" />
                            </BackgroundBlock>

                            <BackgroundBlock mode="default">
                                <TextBlock text="Default - nested in five levels" works="yes" />
                            </BackgroundBlock>
                        </BackgroundBlock>
                    </BackgroundBlock>
                </BackgroundBlock>
            </BackgroundBlock>

            <BackgroundBlock mode="inverted">
                <TextBlock text="Inverted - directly in Root" works="yes" />

                <BackgroundBlock mode="default">
                    <TextBlock text="Default - nested in Inverted" works="yes" />

                    <BackgroundBlock mode="inverted">
                        <TextBlock text="Inverted - nested in three levels" works="yes" />

                        <BackgroundBlock mode="default">
                            <TextBlock text="Default - nested in four levels" works="yes" />

                            <BackgroundBlock mode="inverted">
                                <TextBlock text="Inverted - nested in five levels" works="yes" />

                                <BackgroundBlock mode="default">
                                    <TextBlock text="Default - nested in six levels" works="yes" />
                                </BackgroundBlock>
                            </BackgroundBlock>
                        </BackgroundBlock>

                        <BackgroundBlock mode="inverted">
                            <TextBlock text="Inverted - nested in four levels" works="yes" />

                            <BackgroundBlock mode="default">
                                <TextBlock text="Default - nested in five levels" works="yes" />
                            </BackgroundBlock>

                            <BackgroundBlock mode="inverted">
                                <TextBlock text="Inverted - nested in five levels" works="yes" />
                            </BackgroundBlock>
                        </BackgroundBlock>
                    </BackgroundBlock>
                </BackgroundBlock>
            </BackgroundBlock>
        </div>
    );
};
