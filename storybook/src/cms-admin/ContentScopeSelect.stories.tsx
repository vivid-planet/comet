import { AppHeader, AppHeaderMenuButton, CometLogo, FillSpace } from "@comet/admin";
import { Domain, Language } from "@comet/admin-icons";
import { ContentScopeSelect, findTextMatches, MarkedMatches } from "@comet/cms-admin";
import { ListItemIcon, ListItemText } from "@mui/material";
import { type Meta } from "@storybook/react";
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
            onChange={(value: { domain: string }) => {
                setValue(value);
            }}
            options={[
                { scope: { domain: "main" }, label: { domain: "Main" } },
                { scope: { domain: "secondary" }, label: { domain: "Secondary" } },
                { scope: { domain: "tertiary" }, label: { domain: "Tertiary" } },
            ]}
        />
    );
};

export const MultipleDimensions = function () {
    const [value, setValue] = useState({ domain: "main", language: "en" });
    return (
        <ContentScopeSelect
            value={value}
            onChange={(value: { domain: string; language: string }) => {
                setValue(value);
            }}
            options={[
                { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
                { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "German" } },
                { scope: { domain: "secondary", language: "en" }, label: { domain: "Secondary", language: "English" } },
                { scope: { domain: "secondary", language: "de" }, label: { domain: "Secondary", language: "German" } },
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
            onChange={(value: { domain: string; language: string }) => {
                setValue(value);
            }}
            options={[
                { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
                { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "German" } },
                { scope: { domain: "secondary", language: "en" }, label: { domain: "Secondary", language: "English" } },
                { scope: { domain: "secondary", language: "de" }, label: { domain: "Secondary", language: "German" } },
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
            onChange={(value: { domain: string; language: string }) => {
                setValue(value);
            }}
            options={[
                { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
                { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "German" } },
                { scope: { domain: "secondary", language: "en" }, label: { domain: "Secondary", language: "English" } },
                { scope: { domain: "secondary", language: "de" }, label: { domain: "Secondary", language: "German" } },
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
            onChange={(value: { domain: string; language: string }) => {
                setValue(value);
            }}
            options={[
                { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
                { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "German" } },
                { scope: { domain: "secondary", language: "en" }, label: { domain: "Secondary", language: "English" } },
                { scope: { domain: "secondary", language: "de" }, label: { domain: "Secondary", language: "German" } },
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
            onChange={(value: { domain: string; language: string }) => {
                setValue(value);
            }}
            options={[
                { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
                { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "German" } },
                { scope: { domain: "secondary", language: "en" }, label: { domain: "Secondary", language: "English" } },
                { scope: { domain: "secondary", language: "de" }, label: { domain: "Secondary", language: "German" } },
            ]}
            renderOption={(option) => (
                <>
                    <ListItemIcon>
                        <Domain />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <>
                                {option.label!.domain} – {option.label!.language}
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
                onChange={(value: { domain: string; language: string }) => {
                    setValue(value);
                }}
                options={[
                    {
                        scope: { domain: "main", language: "en" },
                        label: { domain: "Main", language: "English" },
                    },
                    {
                        scope: { domain: "main", language: "de" },
                        label: { domain: "Main", language: "German" },
                    },
                    {
                        scope: { domain: "secondary", language: "en" },
                        label: { domain: "Secondary", language: "English" },
                    },
                    {
                        scope: { domain: "secondary", language: "de" },
                        label: { domain: "Secondary", language: "German" },
                    },
                ]}
                renderOption={(option, query) => {
                    const text = `${option.label!.domain} – ${option.label!.language}`;
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
            onChange={(value: { domain: string; language: string }) => {
                setValue(value);
            }}
            options={[
                { scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } },
                { scope: { domain: "main", language: "de" }, label: { domain: "Main", language: "German" } },
                { scope: { domain: "secondary", language: "en" }, label: { domain: "Secondary", language: "English" } },
                { scope: { domain: "secondary", language: "de" }, label: { domain: "Secondary", language: "German" } },
            ]}
            renderSelectedOption={(option) => (
                <>
                    {option.label!.domain}: {option.label!.language}
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
            onChange={(value: { company: string; country: string; language: string }) => {
                setValue(value);
            }}
            options={[
                {
                    scope: { company: "a-inc", country: "at", language: "de" },
                    label: { company: "A Inc.", country: "Austria", language: "German" },
                },
                {
                    scope: { company: "a-inc", country: "at", language: "en" },
                    label: { company: "A Inc.", country: "Austria", language: "English" },
                },
                {
                    scope: { company: "b-inc", country: "at", language: "de" },
                    label: { company: "B Inc.", country: "Austria", language: "German" },
                },
                {
                    scope: { company: "b-inc", country: "at", language: "en" },
                    label: { company: "B Inc.", country: "Austria", language: "English" },
                },
                {
                    scope: { company: "c-inc", country: "ch", language: "de" },
                    label: { company: "C Inc.", country: "Switzerland", language: "German" },
                },
                {
                    scope: { company: "c-inc", country: "ch", language: "en" },
                    label: { company: "C Inc.", country: "Switzerland", language: "English" },
                },
                {
                    scope: { company: "c-inc", country: "ch", language: "fr" },
                    label: { company: "C Inc.", country: "Switzerland", language: "French" },
                },
            ]}
            groupBy="company"
            searchable
        />
    );
};

ThreeDimensions.storyName = "Three dimensions";
