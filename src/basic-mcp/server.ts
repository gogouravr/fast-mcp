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
        resources: {},
        prompts: {},
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
        {
          name: "calculate",
          description: "Perform basic arithmetic calculations",
          inputSchema: {
            type: "object",
            properties: {
              operation: {
                type: "string",
                enum: ["add", "subtract", "multiply", "divide"],
                description: "The arithmetic operation to perform",
              },
              a: {
                type: "number",
                description: "First number",
              },
              b: {
                type: "number",
                description: "Second number",
              },
            },
            required: ["operation", "a", "b"],
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

    if (name === "calculate") {
      const operation = args?.operation as string;
      const a = args?.a as number;
      const b = args?.b as number;

      let result: number;
      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0) {
            throw new Error("Division by zero is not allowed");
          }
          result = a / b;
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      return {
        content: [
          {
            type: "text",
            text: `${a} ${operation} ${b} = ${result}`,
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  });

  // Register resources
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
                serverName: "basic-mcp-server",
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

  // Register prompts
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

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Basic MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

