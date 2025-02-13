export function getStatusCodeClass(code: number): "info" | "success" | "redirect" | "client_error" | "server_error" {
    if (code < 200) return "info";
    if (code < 300) return "success";
    if (code < 400) return "redirect";
    if (code < 500) return "client_error";
    return "server_error";
}
