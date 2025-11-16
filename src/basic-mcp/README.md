# Basic MCP Server

A clean, minimal implementation of an MCP server using only the official MCP TypeScript SDK - no framework dependencies.

## Features

- ✅ **Tools**: `hello` and `calculate`
- ✅ **Resources**: `demo://example` and `demo://config`
- ✅ **Prompts**: `greet_user` and `explain_mcp`

## Usage

Build and run:
```bash
npm run build
node dist/basic-mcp/server.js
```

Or use directly with tsx:
```bash
npx tsx src/basic-mcp/server.ts
```

## Differences from Main Server

This implementation is identical in functionality to the main server (`src/index.ts`) but organized as a separate, standalone implementation to demonstrate:

- Clean, minimal MCP server structure
- Direct use of MCP SDK without abstractions
- Same capabilities with simpler organization

