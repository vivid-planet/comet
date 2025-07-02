import { AppHeader, AppHeaderMenuButton, CometLogo, FillSpace } from "@comet/admin";
import { Domain, Language } from "@comet/admin-icons";
import { ContentScopeSelect, findTextMatches, MarkedMatches } from "@comet/cms-admin";
import { ListItemIcon, ListItemText } from "@mui/material";
import { Meta } from "@storybook/react";
import { useState } from "react";

export default {
    title: "@comet/cms-admin/Content Scope Select",

    decorators: [
        (story) => (
            <AppHeader position="relative" headerHeight={60}>
                <AppHeaderMenuButton />
                <CometLogo />
                <FillSpace />
                {story()}
            </AppHeader>
        ),
    ],
} as Meta<typeof ContentScopeSelect>;

export const Basic = function () {
    const [value, setValue] = useState({ domain: "main" });
    return (
        <ContentScopeSelect
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                { domain: { label: "Main", value: "main" } },
                { domain: { label: "Secondary", value: "secondary" } },
                { domain: { label: "Tertiary", value: "tertiary" } },
            ]}
        />
    );
};

export const MultipleDimensions = function () {
    const [value, setValue] = useState({ domain: "main", language: "en" });
    return (
        <ContentScopeSelect
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                { domain: { label: "Main", value: "main" }, language: { label: "English", value: "en" } },
                { domain: { label: "Main", value: "main" }, language: { label: "German", value: "de" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "English", value: "en" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "German", value: "de" } },
            ]}
        />
    );
};

MultipleDimensions.storyName = "Multiple dimensions";

export const Searchable = function () {
    const [value, setValue] = useState({ domain: "main", language: "en" });
    return (
        <ContentScopeSelect
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                { domain: { label: "Main", value: "main" }, language: { label: "English", value: "en" } },
                { domain: { label: "Main", value: "main" }, language: { label: "German", value: "de" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "English", value: "en" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "German", value: "de" } },
            ]}
            searchable
        />
    );
};

export const Groups = function () {
    const [value, setValue] = useState({ domain: "main", language: "en" });
    return (
        <ContentScopeSelect
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                { domain: { label: "Main", value: "main" }, language: { label: "English", value: "en" } },
                { domain: { label: "Main", value: "main" }, language: { label: "German", value: "de" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "English", value: "en" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "German", value: "de" } },
            ]}
            groupBy="domain"
            searchable
        />
    );
};

export const CustomIcon = function () {
    const [value, setValue] = useState({ domain: "main", language: "en" });
    return (
        <ContentScopeSelect
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                { domain: { label: "Main", value: "main" }, language: { label: "English", value: "en" } },
                { domain: { label: "Main", value: "main" }, language: { label: "German", value: "de" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "English", value: "en" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "German", value: "de" } },
            ]}
            icon={<Language />}
        />
    );
};

CustomIcon.storyName = "Custom icon";

export const CustomRenderOption = function () {
    const [value, setValue] = useState({ domain: "main", language: "en" });
    return (
        <ContentScopeSelect
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                { domain: { label: "Main", value: "main" }, language: { label: "English", value: "en" } },
                { domain: { label: "Main", value: "main" }, language: { label: "German", value: "de" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "English", value: "en" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "German", value: "de" } },
            ]}
            renderOption={(option) => (
                <>
                    <ListItemIcon>
                        <Domain />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <>
                                {option.domain.label} – {option.language.label}
                            </>
                        }
                    />
                </>
            )}
        />
    );
};

CustomRenderOption.storyName = "Custom renderOption";

export const CustomRenderOptionWithSearchHighlighting = {
    render: () => {
        const [value, setValue] = useState({ domain: "main", language: "en" });
        return (
            <ContentScopeSelect
                value={value}
                searchable
                onChange={(value) => {
                    setValue(value);
                }}
                options={[
                    { domain: { label: "Main", value: "main" }, language: { label: "English", value: "en" } },
                    { domain: { label: "Main", value: "main" }, language: { label: "German", value: "de" } },
                    { domain: { label: "Secondary", value: "secondary" }, language: { label: "English", value: "en" } },
                    { domain: { label: "Secondary", value: "secondary" }, language: { label: "German", value: "de" } },
                ]}
                renderOption={(option, query) => {
                    const text = `${option.domain.label} – ${option.language.label}`;
                    const matches = findTextMatches(text, query);
                    return <ListItemText primary={<MarkedMatches text={text} matches={matches} />} />;
                }}
            />
        );
    },
    name: "Custom renderOption with search highlighting",
};

export const CustomRenderSelectedOption = function () {
    const [value, setValue] = useState({ domain: "main", language: "en" });
    return (
        <ContentScopeSelect
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                { domain: { label: "Main", value: "main" }, language: { label: "English", value: "en" } },
                { domain: { label: "Main", value: "main" }, language: { label: "German", value: "de" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "English", value: "en" } },
                { domain: { label: "Secondary", value: "secondary" }, language: { label: "German", value: "de" } },
            ]}
            renderSelectedOption={(option) => (
                <>
                    {option.domain.label}: {option.language.label}
                </>
            )}
        />
    );
};

CustomRenderSelectedOption.storyName = "Custom renderSelectedOption";

export const ThreeDimensions = function () {
    const [value, setValue] = useState({ company: "a-inc", country: "at", language: "de" });
    return (
        <ContentScopeSelect
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                {
                    company: { label: "A Inc.", value: "a-inc" },
                    country: { label: "Austria", value: "at" },
                    language: { label: "German", value: "de" },
                },
                {
                    company: { label: "A Inc.", value: "a-inc" },
                    country: { label: "Austria", value: "at" },
                    language: { label: "English", value: "en" },
                },
                {
                    company: { label: "B Inc.", value: "b-inc" },
                    country: { label: "Austria", value: "at" },
                    language: { label: "German", value: "de" },
                },
                {
                    company: { label: "B Inc.", value: "b-inc" },
                    country: { label: "Austria", value: "at" },
                    language: { label: "English", value: "en" },
                },
                {
                    company: { label: "C Inc.", value: "c-inc" },
                    country: { label: "Switzerland", value: "ch" },
                    language: { label: "German", value: "de" },
                },
                {
                    company: { label: "C Inc.", value: "c-inc" },
                    country: { label: "Switzerland", value: "ch" },
                    language: { label: "English", value: "en" },
                },
                {
                    company: { label: "C Inc.", value: "c-inc" },
                    country: { label: "Switzerland", value: "ch" },
                    language: { label: "French", value: "fr" },
                },
            ]}
            groupBy="company"
            searchable
        />
    );
};

ThreeDimensions.storyName = "Three dimensions";

export const GroupingWithOptionalScopeParts = function () {
    interface ContentScope {
        country: string;
        company?: string;
    }

    const [value, setValue] = useState({ country: "at" });
    return (
        <ContentScopeSelect<ContentScope>
            value={value}
            onChange={(value) => {
                setValue(value);
            }}
            options={[
                {
                    country: { label: "AT Overview", value: "at" },
                },
                {
                    country: { label: "DE Overview", value: "de" },
                },
                {
                    country: { label: "Austria", value: "at" },
                    company: { label: "A Inc.", value: "a-inc" },
                },
                {
                    country: { label: "Austria", value: "at" },
                    company: { label: "B Inc.", value: "b-inc" },
                },
                {
                    country: { label: "Germany", value: "de" },
                    company: { label: "A Inc.", value: "a-inc" },
                },
                {
                    country: { label: "Germany", value: "de" },
                    company: { label: "B Inc.", value: "b-inc" },
                },
            ]}
            groupBy="country"
            searchable
            renderOption={(option, query) => {
                let text: string;
                if (option.company?.value === undefined) {
                    text = option.country.label ?? option.country.value;
                } else {
                    text = option.company.label ?? option.company.value;
                }

                const matches = findTextMatches(text, query);

                return (
                    <>
                        <ListItemIcon>
                            <Domain />
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{ variant: "body2", fontWeight: "inherit" }}
                            sx={{ margin: 0 }}
                            primary={<MarkedMatches text={text} matches={matches} />}
                        />
                    </>
                );
            }}
        />
    );
};

GroupingWithOptionalScopeParts.storyName = "Grouping with optional scope parts";
