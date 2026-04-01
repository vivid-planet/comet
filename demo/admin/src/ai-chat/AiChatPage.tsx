import { Button } from "@comet/admin";
import { BlockPreview, IFrameBridgeProvider, useBlockContext, useBlockPreview, useContentScope, useSiteConfig } from "@comet/cms-admin";
import { Box, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

type MessagePart =
    | { type: "text"; text: string }
    | { type: "toolCall"; id: string; name: string; args: string; result?: string }
    | { type: "notice"; text: string };

interface Message {
    role: "user" | "assistant";
    parts: MessagePart[];
}

interface StreamEvent {
    text?: string;
    toolUse?: { id: string; name: string; args: string };
    toolResult?: { id: string; result: string };
    toolErrorLine?: string;
    maxTokens?: boolean;
    permissionRequest?: { requestId: string; toolName: string; newData: unknown; currentData: unknown };
}

function PageContentPreview({ currentData, newData }: { currentData: any; newData: any }) {
    const blockContext = useBlockContext();
    const blockContextRef = useRef(blockContext);
    blockContextRef.current = blockContext;
    const { scope } = useContentScope();
    const siteConfig = useSiteConfig({ scope });
    const previewApi = useBlockPreview();
    const [previewState, setPreviewState] = useState<unknown>(undefined);
    console.log("render PageContentPreview", currentData, newData);

    useEffect(() => {
        console.log("PageContentPreveiw useEffect");
        if (!newData || !newData.content) return;
        async function compute() {
            const currentState = await PageContentBlock.output2State(currentData.content, blockContextRef.current);
            const newState = PageContentBlock.input2State(newData.content);
            console.log("data", currentData, newData);

            const currentKeys = new Set(currentState.blocks.map((b) => b.key));
            const newKeys = new Set(newState.blocks.map((b) => b.key));
            console.log("keys", currentKeys, newKeys);
            const combinedBlocks = [
                ...newState.blocks.map((b) => ({
                    ...b,
                    ...(currentKeys.has(b.key) ? {} : { previewType: "added" as const }),
                })),
                ...currentState.blocks.filter((b) => !newKeys.has(b.key)).map((b) => ({ ...b, previewType: "removed" as const })),
            ];
            const combinedState = { ...newState, blocks: combinedBlocks };
            console.log("combinedState", combinedState);

            const ps = PageContentBlock.createPreviewState(combinedState, {
                ...blockContextRef.current,
                //parentUrl: `${siteConfig.blockPreviewBaseUrl}/page`,
                parentUrl: "/",
                //showVisibleOnly: previewApi.showOnlyVisible,
                showVisibleOnly: false,
            });
            setPreviewState(ps);
        }
        void compute();
    }, [currentData, newData /*siteConfig, previewApi.showOnlyVisible*/]);

    //return <pre>{JSON.stringify(previewState as any)}</pre>;

    console.log("previewState", previewState);

    const previewUrl = `${siteConfig.blockPreviewBaseUrl}/page`;
    return (
        <IFrameBridgeProvider key={previewUrl}>
            <Box sx={{ height: 400 }}>
                <BlockPreview url={previewUrl} previewState={previewState} previewApi={previewApi} />
            </Box>
        </IFrameBridgeProvider>
    );
}

export function AiChatPage() {
    const conversationId = useRef(crypto.randomUUID());
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [permissionRequest, setPermissionRequest] = useState<{
        requestId: string;
        toolName: string;
        newData: unknown;
        currentData: unknown;
    } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const apiUrl = `${window.location.origin}/api`;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const appendTextToLastAssistantMessage = (chunk: string) => {
        setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return prev;
            const parts = last.parts;
            const lastPart = parts[parts.length - 1];
            if (lastPart?.type === "text") {
                return [...prev.slice(0, -1), { ...last, parts: [...parts.slice(0, -1), { type: "text" as const, text: lastPart.text + chunk }] }];
            }
            return [...prev.slice(0, -1), { ...last, parts: [...parts, { type: "text" as const, text: chunk }] }];
        });
    };

    const addPartToLastAssistantMessage = (part: MessagePart) => {
        setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (!last || last.role !== "assistant") return prev;
            return [...prev.slice(0, -1), { ...last, parts: [...last.parts, part] }];
        });
    };

    const sendMessage = async () => {
        const message = input.trim();
        if (!message || streaming) return;

        setInput("");
        setStreaming(true);
        setMessages((prev) => [...prev, { role: "user", parts: [{ type: "text", text: message }] }, { role: "assistant", parts: [] }]);

        try {
            const response = await fetch(`${apiUrl}/ai-chat/stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ conversationId: conversationId.current, message }),
            });

            if (!response.ok || !response.body) {
                throw new Error(`Request failed: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const data = line.slice(6);
                    if (data === "[DONE]") break;
                    try {
                        const parsed = JSON.parse(data) as StreamEvent;
                        if (parsed.text) {
                            appendTextToLastAssistantMessage(parsed.text);
                        } else if (parsed.toolUse) {
                            addPartToLastAssistantMessage({
                                type: "toolCall",
                                id: parsed.toolUse.id,
                                name: parsed.toolUse.name,
                                args: parsed.toolUse.args,
                            });
                        } else if (parsed.toolResult) {
                            const { id, result } = parsed.toolResult;
                            setMessages((prev) => {
                                const last = prev[prev.length - 1];
                                if (!last || last.role !== "assistant") return prev;
                                const parts = last.parts.map((part) => (part.type === "toolCall" && part.id === id ? { ...part, result } : part));
                                return [...prev.slice(0, -1), { ...last, parts }];
                            });
                        } else if (parsed.toolErrorLine) {
                            addPartToLastAssistantMessage({ type: "notice", text: `❌ Error: ${parsed.toolErrorLine}` });
                        } else if (parsed.maxTokens) {
                            addPartToLastAssistantMessage({ type: "notice", text: "⚠️ Response was cut off because the token limit was reached." });
                        } else if (parsed.permissionRequest) {
                            setPermissionRequest(parsed.permissionRequest);
                        }
                        scrollToBottom();
                    } catch {
                        // ignore malformed events
                    }
                }
            }
        } catch {
            setMessages((prev) => {
                const last = prev[prev.length - 1];
                return [...prev.slice(0, -1), { ...last, parts: [{ type: "notice", text: "Error: Could not get a response." }] }];
            });
        } finally {
            setStreaming(false);
            scrollToBottom();
        }
    };

    const respondToPermission = async (approved: boolean) => {
        if (!permissionRequest) return;
        const { requestId } = permissionRequest;
        setPermissionRequest(null);
        await fetch(`${apiUrl}/ai-chat/permission-response`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ requestId, approved }),
        });
    };
    console.log("render AiChatPage");

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
                {messages.map((msg, i) => (
                    <Box
                        key={i}
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
                            if (part.type === "text") {
                                return (
                                    <Typography key={j} variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                        {part.text}
                                    </Typography>
                                );
                            }
                            if (part.type === "toolCall") {
                                return (
                                    <details key={j}>
                                        <summary style={{ cursor: "pointer", fontSize: "0.75rem", opacity: 0.7 }}>{`Tool: ${part.name}`}</summary>
                                        <pre style={{ fontSize: "0.7rem", overflowX: "auto", maxHeight: 200, margin: "4px 0 0" }}>
                                            {"Input:\n"}
                                            {JSON.stringify(JSON.parse(part.args), null, 2)}
                                        </pre>
                                        {part.result !== undefined && (
                                            <pre style={{ fontSize: "0.7rem", overflowX: "auto", maxHeight: 200, margin: "4px 0 0" }}>
                                                {"Output:\n"}
                                                {(() => {
                                                    try {
                                                        return JSON.stringify(JSON.parse(part.result), null, 2);
                                                    } catch {
                                                        return part.result;
                                                    }
                                                })()}
                                            </pre>
                                        )}
                                    </details>
                                );
                            }
                            return (
                                <Typography key={j} variant="body2" sx={{ opacity: 0.7 }}>
                                    {part.text}
                                </Typography>
                            );
                        })}
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </Paper>
            {permissionRequest && (
                <Paper variant="outlined" sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, borderColor: "warning.main" }}>
                    <Typography variant="body2">
                        <FormattedMessage
                            id="aiChat.permissionRequest"
                            defaultMessage="Claude wants to call {toolName}. Allow this action?"
                            values={{ toolName: <strong>{permissionRequest.toolName}</strong> }}
                        />
                    </Typography>
                    <PageContentPreview currentData={permissionRequest.currentData} newData={permissionRequest.newData} />
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
                            void sendMessage();
                        }
                    }}
                    disabled={streaming}
                    multiline
                    maxRows={4}
                />
                <Button onClick={() => void sendMessage()} disabled={!input.trim() || streaming} sx={{ minWidth: 80 }}>
                    {streaming ? <CircularProgress size={20} color="inherit" /> : <FormattedMessage id="aiChat.send" defaultMessage="Send" />}
                </Button>
            </Box>
        </Box>
    );
}
