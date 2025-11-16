# Running the MCP Server

## Quick Start

### 1. Build the project
```bash
npm run build
```

### 2. Run the server
```bash
npm start
```

The server will start and wait for MCP protocol messages on stdin/stdout.

## What You'll See

When you run `npm start`, you'll see:
```
FastMCP Demo Server running on stdio
```

The server is now **waiting for MCP protocol messages**. It communicates via JSON-RPC over stdio (standard input/output).

## Testing the Server

### Option 1: Manual Test (Quick Verification)

Send an initialization request:
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' | npm start
```

You should see a response like:
```json
{
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {},
      "resources": {},
      "prompts": {}
    },
    "serverInfo": {
      "name": "fast-mcp-demo",
      "version": "0.1.0"
    }
  },
  "jsonrpc": "2.0",
  "id": 1
}
```

### Option 2: Use an MCP Client

The server is designed to work with MCP-compatible clients like:

1. **Claude Desktop** - Add to your MCP configuration
2. **MCP Inspector** - Debugging tool
3. **Custom MCP Client** - Build your own

### Option 3: Development Mode

For development with auto-reload:
```bash
npm run dev
```

## How MCP Servers Work

MCP servers communicate using **JSON-RPC 2.0** over **stdio** (standard input/output):

1. Client sends JSON-RPC requests to server's stdin
2. Server processes requests and sends responses to stdout
3. Server logs/errors go to stderr

This is why when you run `npm start`, it appears to "hang" - it's actually waiting for input!

## Example: Testing Tools

To test the `hello` tool, you would send:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "hello",
    "arguments": {
      "name": "World"
    }
  }
}
```

## Connecting to Claude Desktop

1. Open Claude Desktop settings
2. Find MCP configuration (usually in `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS)
3. Add:

```json
{
  "mcpServers": {
    "fast-mcp-demo": {
      "command": "node",
      "args": ["/absolute/path/to/fast-mcp/dist/index.js"]
    }
  }
}
```

4. Restart Claude Desktop
5. Your server's tools, resources, and prompts will be available!

## Troubleshooting

- **Server won't start**: Make sure you ran `npm run build` first
- **No response**: Check that you're sending valid JSON-RPC messages
- **Connection issues**: Verify the path in your MCP client configuration is correct

