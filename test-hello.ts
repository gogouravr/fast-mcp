#!/usr/bin/env node

/**
 * Test script to call the hello tool
 */

import { spawn } from "child_process";
import { join } from "path";

const serverPath = join(process.cwd(), "dist", "index.js");

console.log("🧪 Testing hello tool...\n");

// Spawn the server process
const server = spawn("node", [serverPath], {
  stdio: ["pipe", "pipe", "pipe"],
});

let requestId = 1;

// Initialize the connection
const initRequest = {
  jsonrpc: "2.0",
  id: requestId++,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: {
      name: "test-client",
      version: "1.0.0",
    },
  },
};

server.stdin.write(JSON.stringify(initRequest) + "\n");

// After initialization, call the hello tool
setTimeout(() => {
  const helloRequest = {
    jsonrpc: "2.0",
    id: requestId++,
    method: "tools/call",
    params: {
      name: "hello",
      arguments: {
        name: "Alice",
      },
    },
  };

  console.log("📤 Sending request:", JSON.stringify(helloRequest, null, 2));
  console.log("\n⏳ Waiting for response...\n");
  
  server.stdin.write(JSON.stringify(helloRequest) + "\n");
}, 200);

// Collect responses
let buffer = "";
server.stdout.on("data", (data) => {
  buffer += data.toString();
  const lines = buffer.split("\n").filter((line) => line.trim());
  
  for (const line of lines) {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        
        if (response.method === "notifications/initialized") {
          // Skip initialization notification
          continue;
        }
        
        if (response.id === 2) {
          // This is our hello tool response
          console.log("✅ Response received:");
          console.log(JSON.stringify(response, null, 2));
          console.log("\n📝 Result:");
          if (response.result?.content?.[0]?.text) {
            console.log(response.result.content[0].text);
          }
          server.kill();
          process.exit(0);
        }
      } catch (e) {
        // Not JSON, might be error output
      }
    }
  }
  buffer = "";
});

server.stderr.on("data", (data) => {
  const message = data.toString();
  if (message.includes("running")) {
    console.log("✅ Server:", message.trim());
  }
});

// Timeout safety
setTimeout(() => {
  console.log("\n⏱️  Test timeout");
  server.kill();
  process.exit(1);
}, 3000);

