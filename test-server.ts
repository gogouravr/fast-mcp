#!/usr/bin/env node

/**
 * Simple test script to verify the MCP server is working
 * This sends a test request to the server via stdio
 */

import { spawn } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

const serverPath = join(process.cwd(), "dist", "index.js");

console.log("Starting MCP server test...\n");
console.log("Server path:", serverPath);
console.log("=" .repeat(50));

// Spawn the server process
const server = spawn("node", [serverPath], {
  stdio: ["pipe", "pipe", "pipe"],
});

// Test request: Initialize the MCP connection
const initRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {
      roots: {
        listChanged: true,
      },
    },
    clientInfo: {
      name: "test-client",
      version: "1.0.0",
    },
  },
};

// Send initialization request
server.stdin.write(JSON.stringify(initRequest) + "\n");

let output = "";

// Collect stdout
server.stdout.on("data", (data) => {
  output += data.toString();
  const lines = output.split("\n").filter((line) => line.trim());
  
  for (const line of lines) {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        console.log("✅ Server Response:", JSON.stringify(response, null, 2));
      } catch (e) {
        // Not JSON, might be error output
      }
    }
  }
  output = "";
});

// Collect stderr (server logs)
server.stderr.on("data", (data) => {
  const message = data.toString();
  if (message.includes("running")) {
    console.log("✅ Server Status:", message.trim());
  }
});

// Handle server exit
server.on("exit", (code) => {
  if (code === 0) {
    console.log("\n✅ Server exited successfully");
  } else {
    console.log(`\n❌ Server exited with code ${code}`);
  }
  process.exit(code || 0);
});

// Send list tools request after a short delay
setTimeout(() => {
  const listToolsRequest = {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  };
  
  console.log("\n📋 Requesting tools list...");
  server.stdin.write(JSON.stringify(listToolsRequest) + "\n");
  
  // Close after getting response
  setTimeout(() => {
    server.kill();
  }, 1000);
}, 500);

// Timeout safety
setTimeout(() => {
  console.log("\n⏱️  Test timeout - closing server");
  server.kill();
  process.exit(0);
}, 5000);

