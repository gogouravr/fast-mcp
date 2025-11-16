# Complete Explanation of Basic MCP Server

This document breaks down every piece of the `server.ts` file to help you understand how an MCP server works.

## File Structure Overview

```
1-12:   Imports and Dependencies
14-19:  Documentation Comments
21-35:  Server Initialization
37-80:  Tool Registration (List Tools)
82-135: Tool Execution Handler
137-155: Resource Registration (List Resources)
157-194: Resource Reading Handler
196-218: Prompt Registration (List Prompts)
220-254: Prompt Execution Handler
256-260: Transport Connection
263-266: Error Handling
```

---

## Section 1: Imports (Lines 1-12)

```typescript
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
```

### What's happening:

1. **`#!/usr/bin/env node`** - Shebang line
   - Makes the file executable directly
   - Tells the system to run this with Node.js
   - Allows: `./server.ts` instead of `node server.ts`

2. **`Server`** - The main MCP server class
   - Core component that handles all MCP protocol communication
   - Manages capabilities, request handlers, and transport

3. **`StdioServerTransport`** - Communication method
   - **stdio** = Standard Input/Output
   - Server reads from stdin, writes to stdout
   - Most common transport for MCP servers
   - Alternative: HTTP/SSE for web-based servers

4. **Request Schemas** - Type definitions for MCP protocol
   - `ListToolsRequestSchema` - Client asks "what tools do you have?"
   - `CallToolRequestSchema` - Client says "run this tool"
   - `ListResourcesRequestSchema` - Client asks "what resources are available?"
   - `ReadResourceRequestSchema` - Client says "give me this resource"
   - `ListPromptsRequestSchema` - Client asks "what prompts do you have?"
   - `GetPromptRequestSchema` - Client says "give me this prompt"

---

## Section 2: Server Initialization (Lines 21-35)

```typescript
async function main() {
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
```

### What's happening:

1. **`async function main()`** - Entry point
   - Async because server operations are asynchronous
   - Called at the bottom of the file

2. **`new Server(...)`** - Creates server instance
   - Takes two arguments: server info and capabilities

3. **First argument: Server Info**
   ```typescript
   {
     name: "basic-mcp-server",  // Identifies this server
     version: "0.1.0",           // Version for compatibility
   }
   ```
   - Sent to clients during initialization
   - Helps clients identify and version-check the server

4. **Second argument: Capabilities**
   ```typescript
   {
     capabilities: {
       tools: {},      // "I can provide tools"
       resources: {},  // "I can provide resources"
       prompts: {},    // "I can provide prompts"
     },
   }
   ```
   - Declares what the server can do
   - Empty objects `{}` mean "I support this feature"
   - Client uses this to know what to ask for

---

## Section 3: Tool Registration (Lines 37-80)

```typescript
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
      // ... calculate tool
    ],
  };
});
```

### What's happening:

1. **`setRequestHandler(ListToolsRequestSchema, ...)`**
   - Registers a handler for "list tools" requests
   - When client asks "what tools do you have?", this runs

2. **Return Value Structure**
   ```typescript
   {
     tools: [ /* array of tool definitions */ ]
   }
   ```
   - Must return an object with a `tools` array
   - Each tool is a complete definition

3. **Tool Definition Structure**
   ```typescript
   {
     name: "hello",                    // Unique identifier
     description: "...",              // What the tool does (for AI)
     inputSchema: {                    // JSON Schema validation
       type: "object",                 // Tool takes an object
       properties: {                   // Properties of that object
         name: {
           type: "string",             // Property type
           description: "...",        // What this parameter is
         },
       },
       required: ["name"],            // Must provide "name"
     },
   }
   ```
   - `name`: How the tool is called
   - `description`: Used by AI to decide when to use the tool
   - `inputSchema`: JSON Schema that validates inputs
   - `required`: Which parameters are mandatory

4. **Why JSON Schema?**
   - Validates inputs before execution
   - Provides type safety
   - Helps AI understand what to pass
   - Standard format for API validation

---

## Section 4: Tool Execution Handler (Lines 82-135)

```typescript
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
  // ... calculate tool
});
```

### What's happening:

1. **`setRequestHandler(CallToolRequestSchema, ...)`**
   - Handles "call tool" requests
   - When client says "run the hello tool", this executes

2. **Request Structure**
   ```typescript
   request.params = {
     name: "hello",           // Which tool to call
     arguments: {             // Parameters for the tool
       name: "Alice"
     }
   }
   ```

3. **Extracting Parameters**
   ```typescript
   const { name, arguments: args } = request.params;
   ```
   - `name`: Which tool was requested
   - `args`: The parameters passed to the tool
   - `args?.name`: Optional chaining (might be undefined)

4. **Tool Logic: hello**
   ```typescript
   if (name === "hello") {
     const userName = (args?.name as string) || "World";
     // If name provided, use it; otherwise default to "World"
     
     return {
       content: [              // MCP requires content array
         {
           type: "text",       // Content type
           text: "...",        // The actual content
         },
       ],
     };
   }
   ```
   - Checks which tool was called
   - Extracts and validates parameters
   - Performs the tool's logic
   - Returns result in MCP format

5. **Tool Logic: calculate**
   ```typescript
   if (name === "calculate") {
     const operation = args?.operation as string;
     const a = args?.a as number;
     const b = args?.b as number;
     
     let result: number;
     switch (operation) {
       case "add": result = a + b; break;
       // ... other operations
       case "divide":
         if (b === 0) {
           throw new Error("Division by zero is not allowed");
         }
         result = a / b;
         break;
     }
     
     return {
       content: [{
         type: "text",
         text: `${a} ${operation} ${b} = ${result}`,
       }],
     };
   }
   ```
   - More complex logic with error handling
   - Validates operation type
   - Prevents division by zero
   - Returns formatted result

6. **Error Handling**
   ```typescript
   throw new Error(`Unknown tool: ${name}`);
   ```
   - If tool doesn't exist, throw error
   - MCP protocol converts this to error response
   - Client receives error message

7. **Return Format**
   ```typescript
   {
     content: [
       {
         type: "text",    // Could also be "image", "resource", etc.
         text: "..."    // The actual content
       }
     ]
   }
   ```
   - Must return `content` array
   - Each item has `type` and content-specific fields
   - `type: "text"` means return text content

---

## Section 5: Resource Registration (Lines 137-155)

```typescript
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "demo://example",
        name: "Example Resource",
        description: "A simple example resource",
        mimeType: "text/plain",
      },
      // ... config resource
    ],
  };
});
```

### What's happening:

1. **Resources vs Tools**
   - **Tools**: Execute actions (functions)
   - **Resources**: Read data (files, configs, etc.)
   - Resources are passive - you read them, not execute them

2. **Resource Definition**
   ```typescript
   {
     uri: "demo://example",        // Unique identifier (like a URL)
     name: "Example Resource",     // Human-readable name
     description: "...",          // What this resource contains
     mimeType: "text/plain",      // Content type (like HTTP)
   }
   ```
   - `uri`: Unique identifier (can be any scheme: `demo://`, `file://`, `http://`, etc.)
   - `mimeType`: Tells client what format the content is in

3. **URI Schemes**
   - `demo://` - Custom scheme for demo resources
   - `file://` - File system resources
   - `http://` - Web resources
   - `database://` - Database resources
   - You can invent your own schemes!

---

## Section 6: Resource Reading Handler (Lines 157-194)

```typescript
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "demo://example") {
    return {
      contents: [                    // Note: "contents" not "content"
        {
          uri,                       // Echo back the URI
          mimeType: "text/plain",    // Content type
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
            2                         // Pretty-print JSON
          ),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});
```

### What's happening:

1. **Request Structure**
   ```typescript
   request.params = {
     uri: "demo://example"  // Which resource to read
   }
   ```

2. **Return Format for Resources**
   ```typescript
   {
     contents: [              // Note: plural "contents"
       {
         uri: "...",          // The resource URI
         mimeType: "...",     // Content type
         text: "..."          // The actual content
       }
     ]
   }
   ```
   - Different from tools: uses `contents` (plural) not `content`
   - Must include `uri` in response
   - `mimeType` tells client how to interpret content

3. **JSON Resource Example**
   ```typescript
   text: JSON.stringify(
     { /* data */ },
     null,    // Replacer (null = no filtering)
     2        // Indentation (2 spaces)
   )
   ```
   - Converts object to formatted JSON string
   - Makes it readable for humans
   - Client can parse it back to object

4. **Error Handling**
   - If URI doesn't exist, throw error
   - Client receives error message

---

## Section 7: Prompt Registration (Lines 196-218)

```typescript
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
        arguments: [],  // No arguments needed
      },
    ],
  };
});
```

### What's happening:

1. **Prompts vs Tools**
   - **Tools**: Execute code, return results
   - **Prompts**: Generate messages for AI, return prompt templates
   - Prompts are like "fill-in-the-blank" templates

2. **Prompt Definition**
   ```typescript
   {
     name: "greet_user",              // Unique identifier
     description: "...",              // What this prompt does
     arguments: [                     // Parameters for the prompt
       {
         name: "name",                // Argument name
         description: "...",         // What this argument is
         required: true,            // Must provide this
       },
     ],
   }
   ```
   - Similar to tool parameters
   - Used to customize the prompt message

3. **Why Prompts?**
   - Pre-defined templates for common AI interactions
   - Consistent formatting
   - Reusable across different contexts
   - Example: "Generate a commit message" prompt

---

## Section 8: Prompt Execution Handler (Lines 220-254)

```typescript
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "greet_user") {
    const userName = (args?.name as string) || "User";
    return {
      messages: [                    // Note: "messages" not "content"
        {
          role: "user",              // Message role
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
```

### What's happening:

1. **Request Structure**
   ```typescript
   request.params = {
     name: "greet_user",      // Which prompt
     arguments: {             // Parameters
       name: "Alice"
     }
   }
   ```

2. **Return Format for Prompts**
   ```typescript
   {
     messages: [              // Array of messages (like chat)
       {
         role: "user",       // Who said it: "user", "assistant", "system"
         content: {
           type: "text",
           text: "..."       // The prompt message
         }
       }
     ]
   }
   ```
   - Returns `messages` array (not `content`)
   - Each message has a `role` (like chat messages)
   - Client uses this to construct a conversation

3. **Message Roles**
   - `"user"`: Message from the user
   - `"assistant"`: Message from the AI
   - `"system"`: System-level instructions
   - Used to build conversation context

4. **Prompt with Arguments**
   ```typescript
   const userName = (args?.name as string) || "User";
   text: `Please create a friendly greeting for ${userName}...`
   ```
   - Extracts arguments
   - Inserts them into the prompt template
   - Creates customized message

5. **Prompt without Arguments**
   ```typescript
   arguments: []  // No arguments
   // ...
   text: "What is the Model Context Protocol (MCP)?..."
   ```
   - Static prompt, no customization
   - Always returns the same message

---

## Section 9: Transport Connection (Lines 256-260)

```typescript
// Connect to stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("FastMCP Demo Server running on stdio");
```

### What's happening:

1. **Create Transport**
   ```typescript
   const transport = new StdioServerTransport();
   ```
   - Creates stdio (standard input/output) transport
   - Server reads from stdin, writes to stdout
   - Errors/logs go to stderr

2. **Connect Server**
   ```typescript
   await server.connect(transport);
   ```
   - Connects server to transport
   - Server starts listening for requests
   - Async operation (waits for connection)

3. **Console Output**
   ```typescript
   console.error("FastMCP Demo Server running on stdio");
   ```
   - Uses `console.error` (goes to stderr)
   - Doesn't interfere with stdout (where responses go)
   - Confirms server is running

4. **How stdio Works**
   ```
   Client → stdin  → Server processes → stdout → Client
                    ↓
                  stderr (logs/errors)
   ```
   - Client sends JSON-RPC requests via stdin
   - Server processes and responds via stdout
   - Logs/errors go to stderr (separate stream)

---

## Section 10: Error Handling (Lines 263-266)

```typescript
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

### What's happening:

1. **Call main()**
   - Executes the main function
   - Starts the server

2. **Error Catching**
   ```typescript
   .catch((error) => {
     // Handle any errors
   })
   ```
   - Catches any unhandled errors
   - Prevents server from crashing silently

3. **Error Reporting**
   ```typescript
   console.error("Fatal error:", error);
   ```
   - Logs error to stderr
   - Helps with debugging

4. **Exit Process**
   ```typescript
   process.exit(1);
   ```
   - Exits with error code 1
   - Signals that server failed
   - 0 = success, non-zero = error

---

## Complete Request/Response Flow

### Example: Calling the "hello" tool

1. **Client sends request** (via stdin):
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

2. **Server receives** → `CallToolRequestSchema` handler runs

3. **Server processes**:
   - Extracts `name: "hello"` and `arguments: { name: "Alice" }`
   - Executes hello tool logic
   - Returns result

4. **Server sends response** (via stdout):
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

5. **Client receives** → Uses the result

---

## Key Concepts Summary

1. **Request Handlers**: Functions that respond to specific MCP requests
2. **Schemas**: Type definitions that validate requests/responses
3. **Tools**: Executable functions that perform actions
4. **Resources**: Read-only data sources
5. **Prompts**: Message templates for AI interactions
6. **Transport**: How the server communicates (stdio, HTTP, etc.)
7. **JSON-RPC**: The protocol used for all communication
8. **Error Handling**: Proper error responses for invalid requests

---

## Why This Structure?

- **Separation of Concerns**: Each handler does one thing
- **Type Safety**: Schemas ensure correct data formats
- **Extensibility**: Easy to add new tools/resources/prompts
- **Protocol Compliance**: Follows MCP specification exactly
- **Error Handling**: Graceful failures with clear messages

This structure makes the server maintainable, testable, and compliant with the MCP protocol!

