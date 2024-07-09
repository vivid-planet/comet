import { AppHeader, AppHeaderFillSpace, AppHeaderMenuButton, CometLogo } from "@comet/admin";
import { Domain, Language } from "@comet/admin-icons";
import { ContentScopeSelect } from "@comet/cms-admin";
import { ListItemIcon, ListItemText } from "@mui/material";
import { storiesOf } from "@storybook/react";
import React, { useState } from "react";

storiesOf("@comet/cms-admin/Content Scope Select", module)
    .addDecorator((story) => (
        <AppHeader position="relative" headerHeight={60}>
            <AppHeaderMenuButton />
            <CometLogo />
            <AppHeaderFillSpace />
            {story()}
        </AppHeader>
    ))
    .add("Basic", function () {
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
    })
    .add("Multiple dimensions", function () {
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
    })
    .add("Searchable", function () {
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
    })
    .add("Groups", function () {
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
    })
    .add("Custom icon", function () {
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
    })
    .add("Custom renderOption", function () {
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
    })
    .add("Custom renderSelectedOption", function () {
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
    })
    .add("Three dimensions", function () {
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
    });
