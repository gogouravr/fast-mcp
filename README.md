# FastMCP Demo - TypeScript MCP Server

A demonstration project to understand the Model Context Protocol (MCP) using TypeScript. This project implements a basic MCP server with tools, resources, and prompts.

## What is MCP?

The Model Context Protocol (MCP) is a standardized protocol that enables AI assistants to securely access external data sources and tools. It provides a way for AI models to:

- **Tools**: Execute functions and operations
- **Resources**: Access data and information
- **Prompts**: Use predefined prompt templates

## Project Structure

```
fast-mcp/
├── src/
│   └── index.ts          # Main MCP server implementation
├── dist/                 # Compiled JavaScript (generated)
├── package.json          # Project dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Features

This demo server includes:

### Tools
- **hello**: A simple greeting tool that welcomes users
- **calculate**: Performs basic arithmetic operations (add, subtract, multiply, divide)

### Resources
- **demo://example**: A simple text resource
- **demo://config**: Server configuration in JSON format

### Prompts
- **greet_user**: Generates a greeting message for a user
- **explain_mcp**: Provides an explanation of what MCP is

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

   Or use the development mode with auto-reload:
   ```bash
   npm run dev
   ```

## How MCP Works

### Server Initialization
The server is created with capabilities for tools, resources, and prompts:

```typescript
const server = new Server(
  { name: "fast-mcp-demo", version: "0.1.0" },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);
```

### Transport
This server uses **stdio** (standard input/output) transport, which means it communicates via stdin/stdout. This is the most common transport for MCP servers.

### Request Handlers
Each capability requires request handlers:
- `ListToolsRequestSchema` - Lists available tools
- `CallToolRequestSchema` - Executes a tool
- `ListResourcesRequestSchema` - Lists available resources
- `ReadResourceRequestSchema` - Reads a resource
- `ListPromptsRequestSchema` - Lists available prompts
- `GetPromptRequestSchema` - Gets a prompt with arguments

## Testing with MCP Clients

To test this server, you'll need an MCP client. Popular options include:

1. **Claude Desktop** - Add the server to your MCP configuration
2. **MCP Inspector** - A debugging tool for MCP servers
3. **Custom MCP Client** - Build your own using the MCP SDK

### Example Configuration (Claude Desktop)

Add to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "fast-mcp-demo": {
      "command": "node",
      "args": ["/path/to/fast-mcp/dist/index.js"]
    }
  }
}
```

## Learning Path

This project was built incrementally to understand MCP concepts:

1. ✅ **Initial Setup** - TypeScript configuration and dependencies
2. ✅ **Basic Server** - Simple server with hello tool
3. ✅ **Resources** - Added resource reading capabilities
4. ✅ **Prompts** - Added prompt templates
5. ✅ **Advanced Tools** - Added calculate tool with error handling

## Key Concepts

### Tools
Tools are functions that the AI can call. They have:
- A name and description
- An input schema (JSON Schema)
- Execution logic that returns results

### Resources
Resources are data sources that can be read. They have:
- A URI identifier
- A name and description
- A MIME type
- Content that can be retrieved

### Prompts
Prompts are template messages that can be used to guide AI interactions. They have:
- A name and description
- Optional arguments
- Message templates

## Next Steps

To extend this demo, consider:

- Adding file system resources
- Implementing authentication
- Adding more complex tools (API calls, database queries)
- Using different transports (SSE, HTTP)
- Adding logging and error handling middleware
- Implementing caching for resources

## Resources

- [MCP Specification](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [FastMCP (Python)](https://gofastmcp.com/) - The Python equivalent

## License

MIT

