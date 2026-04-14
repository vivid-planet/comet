import { useChat } from "@ai-sdk/react";
import { Button } from "@comet/admin";
import { Box, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import {
    DefaultChatTransport,
    getToolName,
    isToolUIPart,
    lastAssistantMessageIsCompleteWithApprovalResponses,
    type UIMessage,
    type UIMessagePart,
} from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

import { PageContentPreview } from "./PageContentPreview";

interface PendingApproval {
    approvalId: string;
    toolName: string;
    input: { pageId: string; content: unknown; seo: unknown; stage: unknown; attachedPageTreeNodeId?: string };
}

function findPendingApproval(messages: UIMessage[]): PendingApproval | null {
    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        for (let j = msg.parts.length - 1; j >= 0; j--) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const part: UIMessagePart<any, any> = msg.parts[j];
            if (isToolUIPart(part) && getToolName(part) === "save_page" && part.state === "approval-requested") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const input = part.input as any;
                return {
                    approvalId: part.approval.id,
                    toolName: "save_page",
                    input,
                };
            }
        }
    }
    return null;
}

export function AiChatPage() {
    const apiUrl = `${window.location.origin}/api`;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");

    const transport = useMemo(
        () =>
            new DefaultChatTransport({
                api: `${apiUrl}/ai-chat/chat`,
                credentials: "include",
            }),
        [apiUrl],
    );

    const { messages, sendMessage, addToolApprovalResponse, status } = useChat({
        transport,
        sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    });

    const isStreaming = status === "streaming" || status === "submitted";

    const pendingApproval = useMemo(() => findPendingApproval(messages), [messages]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const respondToApproval = (approved: boolean) => {
        if (!pendingApproval) return;
        void addToolApprovalResponse({
            id: pendingApproval.approvalId,
            approved,
            reason: approved ? undefined : "Permission denied by user.",
        });
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
                                            {(part.state === "input-streaming" ||
                                                part.state === "input-available" ||
                                                part.state === "approval-requested") &&
                                                " (pending...)"}
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
                                        {part.state === "output-denied" && (
                                            <Typography variant="body2" sx={{ color: "warning.main", fontSize: "0.7rem" }}>
                                                <FormattedMessage id="aiChat.toolDenied" defaultMessage="⛔ Denied by user" />
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
            {pendingApproval && (
                <Paper variant="outlined" sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, borderColor: "warning.main" }}>
                    <Typography variant="body2">
                        <FormattedMessage
                            id="aiChat.permissionRequest"
                            defaultMessage="Claude wants to call {toolName}. Allow this action?"
                            values={{ toolName: <strong>{pendingApproval.toolName}</strong> }}
                        />
                    </Typography>
                    <PageContentPreview pageId={pendingApproval.input.pageId} newData={pendingApproval.input} />
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button onClick={() => respondToApproval(true)}>
                            <FormattedMessage id="aiChat.permissionApprove" defaultMessage="Approve" />
                        </Button>
                        <Button onClick={() => respondToApproval(false)}>
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
