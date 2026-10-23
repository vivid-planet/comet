import { Radio, RadioGroup, Switch } from "@dextinity/ui";
import { css, styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";

import { useUiTheme } from "./UiThemeProvider";
import { uiThemes } from "./uiThemes";

export function UiThemeSwitch() {
    const { theme, colorScheme, setTheme, setColorScheme } = useUiTheme();

    return (
        <Root>
            <RadioGroup
                label={<FormattedMessage id="uiThemeSwitch.theme" defaultMessage="Theme" />}
                value={theme}
                onValueChange={(value) => setTheme(String(value))}
            >
                <ThemeOptions>
                    {uiThemes.map((uiTheme) => (
                        <Radio key={uiTheme.value} value={uiTheme.value}>
                            {uiTheme.title}
                        </Radio>
                    ))}
                </ThemeOptions>
            </RadioGroup>
            <Switch checked={colorScheme === "dark"} onCheckedChange={(checked) => setColorScheme(checked ? "dark" : "light")}>
                <FormattedMessage id="uiThemeSwitch.darkMode" defaultMessage="Dark mode" />
            </Switch>
        </Root>
    );
}

const Root = styled("div")(
    ({ theme }) => css`
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing(4)};
    `,
);

const ThemeOptions = styled("div")(
    ({ theme }) => css`
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: ${theme.spacing(2, 4)};
    `,
);
