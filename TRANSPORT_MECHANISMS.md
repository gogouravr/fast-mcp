# MCP Transport Mechanisms

## Core Principle

**All MCP transports use JSON-RPC 2.0 as the protocol.**

The transport mechanism is just the **delivery method** - how the JSON-RPC messages are sent and received. The actual protocol (JSON-RPC 2.0) remains the same across all transports.

## Transport Types

### 1. **stdio (Standard Input/Output)**

**How it works:**
- Client sends JSON-RPC requests via **stdin** (standard input)
- Server sends JSON-RPC responses via **stdout** (standard output)
- Logs/errors go to **stderr** (standard error)

**Example:**
```bash
# Client sends request to stdin
echo '{"jsonrpc":"2.0","id":1,"method":"initialize",...}' | node server.js

# Server reads from stdin, writes to stdout
```

**Use cases:**
- Local development
- CLI tools
- Process-to-process communication
- Most common for MCP servers

**Pros:**
- Simple, no network setup
- Works everywhere
- Secure (no network exposure)

**Cons:**
- Only works locally
- One client per server instance
- Process must stay alive

---

### 2. **HTTP/SSE (Server-Sent Events)**

**How it works:**
- Client sends JSON-RPC requests via **HTTP POST**
- Server sends JSON-RPC responses via **SSE stream**
- Uses standard HTTP protocol

**Example:**
```typescript
// Server
server.start({
  transportType: "httpStream",
  httpStream: {
    port: 8080,
  },
});

// Client sends HTTP POST
POST http://localhost:8080/sse
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  ...
}
```

**Use cases:**
- Web applications
- Remote servers
- Multiple clients
- Production deployments

**Pros:**
- Works over network
- Multiple clients
- Standard HTTP (works through firewalls/proxies)
- Can use HTTPS for security

**Cons:**
- Requires network setup
- More complex than stdio
- Need to handle CORS, authentication

---

### 3. **HTTP (Request/Response)**

**How it works:**
- Client sends JSON-RPC request via **HTTP POST**
- Server responds with JSON-RPC in **HTTP response body**
- Standard request/response pattern

**Example:**
```typescript
// Server
server.start({
  transportType: "http",
  http: {
    port: 8080,
  },
});

// Client
POST http://localhost:8080/mcp
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {...}
}
```

**Use cases:**
- REST-like APIs
- Stateless operations
- Simple HTTP clients

**Pros:**
- Simple HTTP requests
- Works with any HTTP client
- Easy to test with curl/Postman

**Cons:**
- No streaming
- Each request is independent
- Less efficient for multiple requests

---

### 4. **WebSocket**

**How it works:**
- Client connects via **WebSocket**
- Sends JSON-RPC messages over WebSocket
- Bidirectional communication

**Example:**
```typescript
// Server
server.start({
  transportType: "websocket",
  websocket: {
    port: 8080,
  },
});

// Client
const ws = new WebSocket("ws://localhost:8080");
ws.send(JSON.stringify({
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  ...
}));
```

**Use cases:**
- Real-time applications
- Browser-based clients
- Interactive applications

**Pros:**
- Bidirectional
- Real-time updates
- Efficient for many messages

**Cons:**
- More complex than HTTP
- Connection management needed
- WebSocket-specific issues

---

## JSON-RPC 2.0 Protocol

Regardless of transport, **all messages follow JSON-RPC 2.0 format:**

### Request Format
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "hello",
    "arguments": {
      "name": "Alice"
    }
  }
}
```

### Response Format
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Hello, Alice! Welcome to MCP!"
      }
    ]
  }
}
```

### Error Format
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Method not found"
  }
}
```

---

## Transport Comparison

| Transport | Protocol | Delivery Method | Use Case |
|-----------|----------|----------------|----------|
| **stdio** | JSON-RPC 2.0 | stdin/stdout | Local, CLI tools |
| **HTTP/SSE** | JSON-RPC 2.0 | HTTP POST + SSE stream | Web apps, remote |
| **HTTP** | JSON-RPC 2.0 | HTTP POST/Response | Simple APIs |
| **WebSocket** | JSON-RPC 2.0 | WebSocket messages | Real-time apps |

---

## Key Points

1. **Same Protocol**: All transports use JSON-RPC 2.0
2. **Different Delivery**: Only the transport layer differs
3. **Interoperable**: Same server code works with different transports
4. **Transport Abstraction**: MCP SDK handles transport details

---

## Example: Same Server, Different Transports

```typescript
// Same server code
const server = new Server({...});

// Just change the transport:
await server.connect(new StdioServerTransport());        // stdio
await server.connect(new SSEServerTransport({port:8080})); // HTTP/SSE
await server.connect(new HTTPServerTransport({port:8080})); // HTTP
```

The JSON-RPC messages are identical - only the delivery method changes!

---

## Why JSON-RPC?

- **Standardized**: Well-defined protocol
- **Language Agnostic**: Works with any language
- **Type Safe**: Structured request/response
- **Error Handling**: Built-in error format
- **Versioned**: Protocol version in requests
- **Extensible**: Easy to add new methods

---

## Summary

✅ **All MCP transports use JSON-RPC 2.0**  
✅ **Transport = delivery method, Protocol = JSON-RPC**  
✅ **Same server code works with different transports**  
✅ **Only the transport layer differs, not the protocol**

The transport is just the "postal service" - JSON-RPC is the "language" they all speak!

