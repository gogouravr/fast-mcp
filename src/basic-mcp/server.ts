#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Basic MCP Server Implementation
 * 
 * A clean, minimal implementation of an MCP server
 * without any framework dependencies
 */

async function main() {
  // Create server instance
  const server = new Server(
    {
      name: "basic-mcp-server",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "hello",
          description: "A simple greeting tool that says hello",
          inputSchema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The name to greet",
              },
            },
            required: ["name"],
          },
        },
      ],
    };
  });

  // Handle tool execution
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "hello") {
      const userName = (args?.name as string) || "World";
      return {
        content: [
          {
            type: "text",
            text: `Hello, ${userName}! Welcome to MCP!`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  });

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Basic MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

