# Available Features in fast-mcp-demo

## 🛠️ Tools (2 available)

Tools are functions that the AI can call to perform actions.

### 1. `hello`
**Description**: A simple greeting tool that says hello

**Parameters**:
- `name` (string, required) - The name to greet

**Example Usage**:
```json
{
  "name": "hello",
  "arguments": {
    "name": "Alice"
  }
}
```

**Returns**: `"Hello, Alice! Welcome to MCP!"`

---

### 2. `calculate`
**Description**: Perform basic arithmetic calculations

**Parameters**:
- `operation` (string, required) - The arithmetic operation to perform
  - Allowed values: `"add"`, `"subtract"`, `"multiply"`, `"divide"`
- `a` (number, required) - First number
- `b` (number, required) - Second number

**Example Usage**:
```json
{
  "name": "calculate",
  "arguments": {
    "operation": "multiply",
    "a": 15,
    "b": 4
  }
}
```

**Returns**: `"15 multiply 4 = 60"`

**Error Handling**: 
- Division by zero throws: `"Division by zero is not allowed"`
- Invalid operation throws: `"Unknown operation: <operation>"`

---

## 📚 Resources (2 available)

Resources are data sources that can be read by the AI.

### 1. `demo://example`
**Name**: Example Resource  
**Description**: A simple example resource  
**MIME Type**: `text/plain`

**Content**: 
```
This is an example resource from the MCP server!
```

---

### 2. `demo://config`
**Name**: Server Configuration  
**Description**: Current server configuration  
**MIME Type**: `application/json`

**Content**:
```json
{
  "serverName": "fast-mcp-demo",
  "version": "0.1.0",
  "capabilities": ["tools", "resources", "prompts"]
}
```

---

## 💬 Prompts (2 available)

Prompts are predefined message templates that can be used to guide AI interactions.

### 1. `greet_user`
**Description**: Generate a greeting message

**Parameters**:
- `name` (string, required) - The name of the person to greet

**Example Usage**:
```json
{
  "name": "greet_user",
  "arguments": {
    "name": "Bob"
  }
}
```

**Returns**: A user message template:
```
"Please create a friendly greeting for Bob. Make it warm and welcoming!"
```

---

### 2. `explain_mcp`
**Description**: Get an explanation of what MCP is

**Parameters**: None (empty array)

**Example Usage**:
```json
{
  "name": "explain_mcp",
  "arguments": {}
}
```

**Returns**: A user message template:
```
"What is the Model Context Protocol (MCP)? Explain it in simple terms."
```

---

## 📊 Summary

| Type | Count | Names |
|------|-------|-------|
| **Tools** | 2 | `hello`, `calculate` |
| **Resources** | 2 | `demo://example`, `demo://config` |
| **Prompts** | 2 | `greet_user`, `explain_mcp` |

## 🧪 Testing the Tools

You can test these tools by:

1. **Using Cursor** (if configured):
   - The tools should appear in Cursor's MCP panel
   - You can ask Cursor to use them: "Use the hello tool to greet John"

2. **Using an MCP Client**:
   - Send JSON-RPC requests to call the tools
   - See `RUNNING.md` for examples

3. **Programmatically**:
   - Use the MCP SDK to connect and call tools
   - See `test-server.ts` for a basic example

## 🔍 Viewing Available Tools Programmatically

To see what tools are available, you can send a `tools/list` request:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

This will return a list of all available tools with their schemas.

