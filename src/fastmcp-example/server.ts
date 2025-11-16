#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { z } from "zod";

/**
 * FastMCP Example Server
 * 
 * This demonstrates using the FastMCP TypeScript framework
 * which provides a simpler API on top of the official MCP SDK
 */

const server = new FastMCP({
  name: "fastmcp-example-server",
  version: "0.1.0",
});

// Add hello tool using FastMCP's simplified API
server.addTool({
  name: "hello",
  description: "A simple greeting tool that says hello",
  parameters: z.object({
    name: z.string().describe("The name to greet"),
  }),
  execute: async (args) => {
    return `Hello, ${args.name}! Welcome to MCP!`;
  },
});

// Add calculate tool
server.addTool({
  name: "calculate",
  description: "Perform basic arithmetic calculations",
  parameters: z.object({
    operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The arithmetic operation to perform"),
    a: z.number().describe("First number"),
    b: z.number().describe("Second number"),
  }),
  execute: async (args) => {
    const { operation, a, b } = args;
    
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
    }
    
    return `${a} ${operation} ${b} = ${result}`;
  },
});

// Add a resource
server.addResource({
  uri: "demo://example",
  name: "Example Resource",
  description: "A simple example resource",
  mimeType: "text/plain",
  async load() {
    return {
      text: "This is an example resource from the FastMCP server!",
    };
  },
});

// Add a prompt
server.addPrompt({
  name: "greet_user",
  description: "Generate a greeting message",
  arguments: [
    {
      name: "name",
      description: "The name of the person to greet",
      required: true,
    },
  ],
  load: async (args) => {
    const userName = args.name || "User";
    return `Please create a friendly greeting for ${userName}. Make it warm and welcoming!`;
  },
});

// Start the server
server.start({
  transportType: "stdio",
});

