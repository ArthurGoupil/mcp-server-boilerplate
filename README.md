# MCP Exploration

A simple TypeScript MCP (Model Context Protocol) server using `@modelcontextprotocol/sdk`.

## Overview

This project demonstrates how to create a basic MCP server with tools that can be accessed by MCP clients like Claude Desktop, VS Code with GitHub Copilot, or other MCP-compatible applications.

## Features

- **Calculator Tool**: Performs basic arithmetic operations (add, subtract, multiply, divide)

## Installation

```bash
pnpm install
```

## Development

Run the server in development mode:

```bash
pnpm dev
```

## Build

Compile TypeScript to JavaScript:

```bash
pnpm build
```

## Run

Start the compiled server:

```bash
pnpm start
```

The server will start on `http://localhost:3000/mcp`.

## Connecting to the Server

### Using VS Code

Add this to your MCP configuration in VS Code:

```json
{
  "mcpServers": {
    "simple-mcp-server": {
      "url": "http://localhost:3000/mcp",
      "type": "http"
    }
  }
}
```

### Using MCPJam

Test your server with the MCPJam:

```bash
pnpx @mcpjam/inspector@latest --port 4000
```

Then create a new server with your MCP url.

## Available Tools

### calculate
Performs basic arithmetic operations.

**Parameters:**
- `operation` (enum): One of "add", "subtract", "multiply", "divide"
- `a` (number): First number
- `b` (number): Second number

**Example:**
```json
{
  "operation": "add",
  "a": 5,
  "b": 3
}
```

## Architecture

This server uses:
- **Express.js** for HTTP server functionality
- **@modelcontextprotocol/sdk** for MCP protocol implementation
- **Zod** for schema validation
- **Streamable HTTP Transport** for stateless request handling

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [TypeScript SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification](https://spec.modelcontextprotocol.io)
