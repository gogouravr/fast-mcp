#!/usr/bin/env node

/**
 * Entry point for the basic MCP server
 */

export { main } from "./server.js";

// If run directly, execute the server
if (import.meta.url === `file://${process.argv[1]}`) {
  import("./server.js").then((module) => module.default?.());
}

