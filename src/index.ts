#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Basic MCP Server Demo
 * 
 * This demonstrates the fundamental concepts of MCP:
 * - Server initialization
 * - Tool registration
 * - Request handling
 */

async function main() {
  // Create a new MCP server instance
  const server = new Server(
    {
      name: "fast-mcp-demo",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // Register a simple "hello" tool
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
      const userName = args?.name as string || "World";
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

  // Register resources (data that can be read by the client)
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "demo://example",
          name: "Example Resource",
          description: "A simple example resource",
          mimeType: "text/plain",
        },
        {
          uri: "demo://config",
          name: "Server Configuration",
          description: "Current server configuration",
          mimeType: "application/json",
        },
      ],
    };
  });

  // Handle resource reading
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri === "demo://example") {
      return {
        contents: [
          {
            uri,
            mimeType: "text/plain",
            text: "This is an example resource from the MCP server!",
          },
        ],
      };
    }

    if (uri === "demo://config") {
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              {
                serverName: "fast-mcp-demo",
                version: "0.1.0",
                capabilities: ["tools", "resources", "prompts"],
              },
              null,
              2
            ),
          },
        ],
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  });

  // Register prompts (predefined prompts that can be used by the client)
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
      prompts: [
        {
          name: "greet_user",
          description: "Generate a greeting message",
          arguments: [
            {
              name: "name",
              description: "The name of the person to greet",
              required: true,
            },
          ],
        },
        {
          name: "explain_mcp",
          description: "Get an explanation of what MCP is",
          arguments: [],
        },
      ],
    };
  });

  // Handle prompt execution
  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "greet_user") {
      const userName = (args?.name as string) || "User";
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Please create a friendly greeting for ${userName}. Make it warm and welcoming!`,
            },
          },
        ],
      };
    }

    if (name === "explain_mcp") {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: "What is the Model Context Protocol (MCP)? Explain it in simple terms.",
            },
          },
        ],
      };
    }

    throw new Error(`Unknown prompt: ${name}`);
  });

  // Connect to stdio transport (standard input/output)
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("FastMCP Demo Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

