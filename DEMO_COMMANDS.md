# MCP Server Demo Commands

## Command 1: Initialize the Server

This sends an initialization request and shows the server's response:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"demo-client","version":"1.0"}}}' | node dist/basic-mcp/server.js
```

**Expected Output:**
- Server log: `Basic MCP Server running on stdio`
- Response: JSON with server capabilities

---

## Command 2: List Available Tools

```bash
(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"demo","version":"1.0"}}}'; sleep 0.1; echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}') | node dist/basic-mcp/server.js
```

**Expected Output:**
- Shows list of available tools (hello, calculate)

---

## Command 3: Call the Hello Tool

```bash
(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"demo","version":"1.0"}}}'; sleep 0.1; echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"hello","arguments":{"name":"Alice"}}}') | node dist/basic-mcp/server.js
```

**Expected Output:**
- Response with: `"Hello, Alice! Welcome to MCP!"`

---

## Command 4: Call the Calculate Tool

```bash
(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"demo","version":"1.0"}}}'; sleep 0.1; echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"calculate","arguments":{"operation":"multiply","a":15,"b":4}}}') | node dist/basic-mcp/server.js
```

**Expected Output:**
- Response with: `"15 multiply 4 = 60"`

---

## Command 5: List Resources

```bash
(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"demo","version":"1.0"}}}'; sleep 0.1; echo '{"jsonrpc":"2.0","id":2,"method":"resources/list","params":{}}') | node dist/basic-mcp/server.js
```

---

## Command 6: Read a Resource

```bash
(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"demo","version":"1.0"}}}'; sleep 0.1; echo '{"jsonrpc":"2.0","id":2,"method":"resources/read","params":{"uri":"demo://example"}}') | node dist/basic-mcp/server.js
```

---

## Pretty Print JSON Responses

To see formatted JSON output, pipe through `jq`:

```bash
(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"demo","version":"1.0"}}}'; sleep 0.1; echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"hello","arguments":{"name":"Alice"}}}') | node dist/basic-mcp/server.js 2>/dev/null | jq .
```

---

## Interactive Mode (Manual Testing)

To manually send requests:

1. Start server in one terminal:
   ```bash
   node dist/basic-mcp/server.js
   ```

2. In another terminal, send requests:
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"demo","version":"1.0"}}}' > /proc/$(pgrep -f "node dist/basic-mcp/server.js")/fd/0
   ```

   (Note: This is complex - better to use the piped commands above)

