import { AppHeader, AppHeaderMenuButton, CometLogo, FillSpace } from "@comet/admin";
import { Domain, Language } from "@comet/admin-icons";
import { ContentScopeSelect, findTextMatches, MarkedMatches } from "@comet/cms-admin";
import { ListItemIcon, ListItemText } from "@mui/material";
import { type Meta } from "@storybook/react-webpack5";
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

export const Basic = {
    render: () => {
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
    },
};

export const MultipleDimensions = {
    render: () => {
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
    },
    name: "Multiple dimensions",
};

export const Searchable = {
    render: () => {
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
    },
};

export const Groups = {
    render: () => {
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
    },
};

export const CustomIcon = {
    render: () => {
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
    },
    name: "Custom icon",
};

export const CustomRenderOption = {
    render: () => {
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
    },
    name: "Custom renderOption",
};

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

export const CustomRenderSelectedOption = {
    render: () => {
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
    },
    name: "Custom renderSelectedOption",
};

export const ThreeDimensions = {
    render: () => {
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
    },
    name: "Three dimensions",
};

export const GroupingWithOptionalScopeParts = {
    render: () => {
        const [value, setValue] = useState({ country: "at" });
        return (
            <ContentScopeSelect
                value={value}
                onChange={(value: { country: string; company?: string }) => {
                    setValue(value);
                }}
                options={[
                    {
                        scope: { country: "at" },
                        label: { country: "AT Overview" },
                    },
                    {
                        scope: { country: "de" },
                        label: { country: "DE Overview" },
                    },
                    {
                        scope: { country: "at", company: "a-inc" },
                        label: { country: "Austria", company: "A Inc." },
                    },
                    {
                        scope: { country: "at", company: "b-inc" },
                        label: { country: "Austria", company: "B Inc." },
                    },
                    {
                        scope: { country: "de", company: "a-inc" },
                        label: { country: "Germany", company: "A Inc." },
                    },
                    {
                        scope: { country: "de", company: "b-inc" },
                        label: { country: "Germany", company: "B Inc." },
                    },
                ]}
                groupBy="country"
                searchable
                renderOption={(option, query, isSelected) => {
                    let text: string;
                    if (option.scope.company === undefined) {
                        text = option.label?.country ?? option.scope.country;
                    } else {
                        text = option.label?.company ?? option.scope.company;
                    }

                    const matches = findTextMatches(text, query);

                    return (
                        <>
                            <ListItemIcon>
                                <Domain />
                            </ListItemIcon>
                            <ListItemText
                                slotProps={{ primary: { variant: isSelected ? "subtitle2" : "body2" } }}
                                sx={{ margin: 0 }}
                                primary={<MarkedMatches text={text} matches={matches} />}
                            />
                        </>
                    );
                }}
            />
        );
    },
    name: "Grouping with optional scope parts",
};
