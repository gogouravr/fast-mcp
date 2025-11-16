# What is an MCP Server Used For?

## The Big Picture

An **MCP (Model Context Protocol) Server** is a bridge between AI assistants (like Claude, ChatGPT, etc.) and the real world. It allows AI models to:

1. **Access external data** (files, databases, APIs)
2. **Perform actions** (send emails, create files, make API calls)
3. **Use predefined prompts** (templates for common tasks)

Think of it as giving AI assistants "hands" and "eyes" to interact with your tools and data.

## Real-World Use Cases

### 1. **File System Access**
Instead of manually copying files, an AI can:
- Read files from your computer
- Write new files
- Search through directories
- Organize files by type/date

**Example**: "Find all my PDF files from last month and create a summary document"

### 2. **Database Queries**
An AI can query your databases without you writing SQL:
- Get customer information
- Analyze sales data
- Generate reports

**Example**: "Show me all customers who purchased in the last 30 days"

### 3. **API Integration**
Connect AI to external services:
- Send emails via Gmail/SendGrid
- Create calendar events
- Post to social media
- Check weather, stocks, news

**Example**: "Send an email to my team about tomorrow's meeting"

### 4. **Code Operations**
AI can interact with your codebase:
- Read code files
- Search for functions
- Create new files
- Run tests

**Example**: "Find all functions that use the database connection and show me their error handling"

### 5. **Web Scraping & Research**
AI can fetch information from the web:
- Get current information
- Research topics
- Compare prices
- Check availability

**Example**: "What are the current prices for flights from NYC to London?"

## How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   AI Model  │ ◄─────► │  MCP Server  │ ◄─────► │ Your Tools  │
│  (Claude)   │         │  (This Demo) │         │ (Files/APIs)│
└─────────────┘         └──────────────┘         └─────────────┘
     User                    Bridge                  Real World
```

1. **User asks AI**: "What files do I have in my Documents folder?"
2. **AI requests tool**: AI calls the MCP server's "list_files" tool
3. **MCP Server executes**: Server reads your file system
4. **Server returns data**: Sends file list back to AI
5. **AI responds to user**: "You have 15 files in Documents..."

## What Our Demo Server Does

Our demo server shows three key MCP concepts:

### 1. **Tools** (Actions AI can take)
```typescript
// AI can call these functions:
- hello(name) → Greets a user
- calculate(operation, a, b) → Does math
```

**Real-world equivalent**: 
- `send_email(to, subject, body)` → Sends an email
- `create_file(path, content)` → Creates a file
- `query_database(sql)` → Runs a database query

### 2. **Resources** (Data AI can read)
```typescript
// AI can read these:
- demo://example → Example text
- demo://config → Server configuration
```

**Real-world equivalent**:
- `file:///Users/you/document.txt` → Read a file
- `database://customers` → Query a database table
- `api://weather/current` → Get weather data

### 3. **Prompts** (Predefined templates)
```typescript
// AI can use these prompt templates:
- greet_user(name) → Template for greeting
- explain_mcp() → Template for explaining MCP
```

**Real-world equivalent**:
- `code_review_prompt(file)` → Template for code review
- `email_template(type)` → Email templates
- `documentation_prompt(api)` → API documentation template

## Why Use MCP Instead of Direct Integration?

### ✅ **Security**
- AI doesn't have direct access to your systems
- You control what tools/resources are available
- Can add authentication and permissions

### ✅ **Standardization**
- One protocol works with all MCP-compatible AI assistants
- Write once, use with Claude, ChatGPT, etc.
- No need to rebuild for each AI platform

### ✅ **Separation of Concerns**
- Your business logic stays in the server
- AI just calls tools, doesn't need to know implementation
- Easy to update/change without affecting AI

### ✅ **Composability**
- Can combine multiple MCP servers
- Mix and match capabilities
- Build complex workflows

## Example: Building a Personal Assistant MCP Server

Here's what a real MCP server might look like:

```typescript
// Tools
- read_calendar(date) → Get calendar events
- create_meeting(title, time, attendees) → Schedule meeting
- send_slack_message(channel, message) → Send Slack message
- get_weather(location) → Get weather forecast
- search_files(query) → Search your files

// Resources
- file:///notes/* → All your notes
- calendar://today → Today's calendar
- contacts://all → Your contacts

// Prompts
- meeting_summary(meeting_id) → Generate meeting summary
- email_draft(type, context) → Draft an email
```

Now an AI assistant could:
- "Schedule a meeting tomorrow at 2pm with John about the project"
- "What's the weather like in San Francisco?"
- "Find my notes about the Q4 planning meeting"
- "Draft an email to my team about the new feature launch"

## The Bottom Line

**MCP Servers turn AI assistants from "chatbots" into "assistants that can actually do things"**

Without MCP: AI can only talk and think
With MCP: AI can read your files, send emails, query databases, control your tools

It's like giving AI a remote control to your digital life (with your permission and control).

## Next Steps

To understand MCP better:
1. **Read the code** in `src/index.ts` - see how tools/resources/prompts are defined
2. **Try connecting** a real MCP client (like Claude Desktop) to this server
3. **Build your own tool** - add a tool that does something you need
4. **Explore real examples** - Check out the [MCP Server Examples](https://github.com/modelcontextprotocol/servers)

