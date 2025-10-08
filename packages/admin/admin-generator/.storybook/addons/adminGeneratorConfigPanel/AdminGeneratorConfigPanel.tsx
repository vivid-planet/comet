// @ts-ignore
import React, { useEffect, useState } from 'react';
import { AddonPanel, SyntaxHighlighter } from 'storybook/internal/components';
import { useStorybookApi } from 'storybook/manager-api';
import { NoConfigHelp } from './NoConfigHelp';

interface AdminGeneratorConfigPanelProps {
    active: boolean;
}

export const AdminGeneratorConfigPanel: React.FC<AdminGeneratorConfigPanelProps> = ({ active }) => {
    const [fileContent, setFileContent] = useState<string>('');
    const api = useStorybookApi();
    const story = api.getCurrentStoryData();
    const configPath = story?.parameters?.adminGeneratorConfig;

    // Helper to get the full relative path
    const getFullPath = (configPath: string) => {
        if (!configPath) return '';
        // Remove './' prefix if it exists
        const cleanPath = configPath.replace(/^\.\//, '');
        return `src/documentation/${cleanPath}`;
    };

    useEffect(() => {
        const loadContent = async () => {
            if (!configPath) {
                return;
            }

            try {
                const response = await fetch(`/src/documentation/${configPath.replace(/^\.\//, '')}`);
                if (!response.ok) throw new Error(`Failed to load file: ${response.statusText}`);
                const content = await response.text();

                // Remove source map comment if present
                const cleanContent = content.replace(/\/\/#\s*sourceMappingURL=.*$/m, '').trim();
                setFileContent(cleanContent);
            } catch (error) {
                console.error('Error loading file:', error);
                setFileContent(`Error loading file: ${error.message}`);
            }
        };

        if (active) {
            loadContent();
        }
    }, [active, configPath]);

    if (!configPath) {
        return (
            <AddonPanel active={active}>
                <NoConfigHelp />
            </AddonPanel>
        );
    }

    return (
        <AddonPanel active={active}>
            <div style={{ padding: '20px' }}>
                <h2>Admin Generator Config</h2>
                <p>Showing config from: <code>{getFullPath(configPath)}</code></p>
                <SyntaxHighlighter language="typescript" copyable={true}>
                    {fileContent}
                </SyntaxHighlighter>
            </div>
        </AddonPanel>
    );
};
