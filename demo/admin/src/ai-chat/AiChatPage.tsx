import { useChat } from "@ai-sdk/react";
import { Button } from "@comet/admin";
import { BlockPreview, IFrameBridgeProvider, useBlockContext, useBlockPreview, useContentScope, useSiteConfig } from "@comet/cms-admin";
import { Box, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

function PageContentPreview({ currentData, newData }: { currentData: unknown; newData: unknown }) {
    const blockContext = useBlockContext();
    const blockContextRef = useRef(blockContext);
    blockContextRef.current = blockContext;
    const { scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });
    const previewApi = useBlockPreview();
    const [previewState, setPreviewState] = useState<unknown>(undefined);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!newData || !(newData as any).content) return;
        async function compute() {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentState = await PageContentBlock.output2State((currentData as any).content, blockContextRef.current);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newState = PageContentBlock.input2State((newData as any).content);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentKeys = new Set((currentState as any).blocks.map((b: any) => b.key));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newKeys = new Set((newState as any).blocks.map((b: any) => b.key));
            const combinedBlocks = [
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(newState as any).blocks.map((b: any) => ({
                    ...b,
                    ...(currentKeys.has(b.key) ? {} : { previewType: "added" as const }),
                })),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ...(currentState as any).blocks.filter((b: any) => !newKeys.has(b.key)).map((b: any) => ({ ...b, previewType: "removed" as const })),
            ];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const combinedState = { ...(newState as any), blocks: combinedBlocks };

            const ps = PageContentBlock.createPreviewState(combinedState, {
                ...blockContextRef.current,
                parentUrl: "/",
                showVisibleOnly: false,
            });
            setPreviewState(ps);
        }
        void compute();
    }, [currentData, newData]);

    const previewUrl = `${siteConfig.blockPreviewBaseUrl}/page`;
    return (
        <IFrameBridgeProvider key={previewUrl}>
            <Box sx={{ height: 400 }}>
                <BlockPreview url={previewUrl} previewState={previewState} previewApi={previewApi} />
            </Box>
        </IFrameBridgeProvider>
    );
}

interface PendingPermission {
    toolCallId: string;
    toolName: string;
    args: { pageId: string; content: unknown; seo: unknown; stage: unknown; attachedPageTreeNodeId?: string };
    currentData: unknown;
}

export function AiChatPage() {
    const apiUrl = `${window.location.origin}/api`;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");
    const [permissionData, setPermissionData] = useState<PendingPermission | null>(null);

    const transport = useMemo(
        () =>
            new DefaultChatTransport({
                api: `${apiUrl}/ai-chat/chat`,
                credentials: "include",
            }),
        [apiUrl],
    );

    const { messages, sendMessage, addToolOutput, status } = useChat({
        transport,
        onToolCall: async ({ toolCall }) => {
            if (toolCall.toolName === "save_page") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const args = (toolCall as any).input;
                let currentData = null;
                try {
                    const resp = await fetch(`${apiUrl}/ai-chat/get-page-current-data`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ pageId: args.pageId }),
                    });
                    currentData = await resp.json();
                } catch {
                    // ignore
                }
                setPermissionData({
                    toolCallId: toolCall.toolCallId,
                    toolName: "save_page",
                    args,
                    currentData,
                });
                // Return undefined — tool call stays pending until addToolOutput is called
                return undefined;
            }
            // Return undefined for auto-executed tools (they have execute handlers on the server)
            return undefined;
        },
    });

    const isStreaming = status === "streaming" || status === "submitted";

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const respondToPermission = async (approved: boolean) => {
        if (!permissionData) return;
        const { toolCallId, args } = permissionData;
        setPermissionData(null);

        if (approved) {
            try {
                const resp = await fetch(`${apiUrl}/ai-chat/execute-save-page`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ args }),
                });
                const data = await resp.json();
                addToolOutput({
                    tool: "save_page",
                    toolCallId,
                    output: data.result,
                });
            } catch {
                addToolOutput({
                    tool: "save_page",
                    toolCallId,
                    state: "output-error",
                    errorText: "Failed to execute save_page",
                });
            }
        } else {
            addToolOutput({
                tool: "save_page",
                toolCallId,
                output: JSON.stringify({ error: "Permission denied by user." }),
            });
        }
    };

    const handleSend = () => {
        const text = input.trim();
        if (!text || isStreaming) return;
        setInput("");
        void sendMessage({ text });
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 64px)", p: 2, gap: 2 }}>
            <Typography variant="h5">
                <FormattedMessage id="aiChat.title" defaultMessage="AI Chat" />
            </Typography>
            <Paper
                variant="outlined"
                sx={{
                    flex: 1,
                    overflow: "auto",
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                {messages.length === 0 && (
                    <Typography color="text.secondary" sx={{ m: "auto" }}>
                        <FormattedMessage id="aiChat.startConversation" defaultMessage="Start a conversation" />
                    </Typography>
                )}
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        sx={{
                            alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                            maxWidth: "75%",
                            bgcolor: msg.role === "user" ? "primary.main" : "grey.100",
                            color: msg.role === "user" ? "primary.contrastText" : "text.primary",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                        }}
                    >
                        {msg.parts.map((part, j) => {
                            if (part.type === "text" && part.text) {
                                return (
                                    <Typography key={j} variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                        {part.text}
                                    </Typography>
                                );
                            }
                            if (isToolUIPart(part)) {
                                const toolName = getToolName(part);
                                return (
                                    <details key={j}>
                                        <summary style={{ cursor: "pointer", fontSize: "0.75rem", opacity: 0.7 }}>
                                            {`Tool: ${toolName}`}
                                            {(part.state === "input-streaming" || part.state === "input-available") && " (pending...)"}
                                        </summary>
                                        {part.input !== undefined && (
                                            <pre style={{ fontSize: "0.7rem", overflowX: "auto", maxHeight: 200, margin: "4px 0 0" }}>
                                                {"Input:\n"}
                                                {JSON.stringify(part.input, null, 2)}
                                            </pre>
                                        )}
                                        {part.state === "output-available" && part.output !== undefined && (
                                            <pre style={{ fontSize: "0.7rem", overflowX: "auto", maxHeight: 200, margin: "4px 0 0" }}>
                                                {"Output:\n"}
                                                {(() => {
                                                    try {
                                                        return JSON.stringify(
                                                            typeof part.output === "string" ? JSON.parse(part.output) : part.output,
                                                            null,
                                                            2,
                                                        );
                                                    } catch {
                                                        return String(part.output);
                                                    }
                                                })()}
                                            </pre>
                                        )}
                                        {part.state === "output-error" && (
                                            <Typography variant="body2" sx={{ color: "error.main", fontSize: "0.7rem" }}>
                                                {`❌ Error: ${part.errorText}`}
                                            </Typography>
                                        )}
                                    </details>
                                );
                            }
                            return null;
                        })}
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Paper>
            {permissionData && (
                <Paper variant="outlined" sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, borderColor: "warning.main" }}>
                    <Typography variant="body2">
                        <FormattedMessage
                            id="aiChat.permissionRequest"
                            defaultMessage="Claude wants to call {toolName}. Allow this action?"
                            values={{ toolName: <strong>{permissionData.toolName}</strong> }}
                        />
                    </Typography>
                    <PageContentPreview currentData={permissionData.currentData} newData={permissionData.args} />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button onClick={() => void respondToPermission(true)}>
                            <FormattedMessage id="aiChat.permissionApprove" defaultMessage="Approve" />
                        </Button>
                        <Button onClick={() => void respondToPermission(false)}>
                            <FormattedMessage id="aiChat.permissionDeny" defaultMessage="Deny" />
                        </Button>
                    </Box>
                </Paper>
            )}
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    disabled={isStreaming}
                    multiline
                    maxRows={4}
                />
                <Button onClick={handleSend} disabled={!input.trim() || isStreaming} sx={{ minWidth: 80 }}>
                    {isStreaming ? <CircularProgress size={20} color="inherit" /> : <FormattedMessage id="aiChat.send" defaultMessage="Send" />}
                </Button>
            </Box>
        </Box>
    );
}
