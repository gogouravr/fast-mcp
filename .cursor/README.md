# Cursor MCP Configuration

This directory contains the MCP server configuration for Cursor IDE.

## Configuration File

The MCP server is configured in `.cursor/mcp.json`.

## Important Note

Cursor may also look for MCP configuration in your user settings. If the project-level configuration doesn't work, you may need to add it to Cursor's global settings:

**macOS**: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`
**Windows**: `%APPDATA%\Cursor\User\globalStorage\mcp.json`
**Linux**: `~/.config/Cursor/User/globalStorage/mcp.json`

## Current Configuration

The server is configured to run from:
```
/Users/gourav/Desktop/_projects/fast-mcp/dist/index.js
```

Make sure you've built the project first:
```bash
npm run build
```

## Restart Cursor

After adding or modifying the MCP configuration, you may need to restart Cursor for the changes to take effect.

## Verifying the Connection

Once configured, you should be able to:
- See the MCP server in Cursor's MCP panel
- Use the tools: `hello` and `calculate`
- Access resources: `demo://example` and `demo://config`
- Use prompts: `greet_user` and `explain_mcp`

