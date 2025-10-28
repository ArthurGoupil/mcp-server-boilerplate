import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
	name: "mcp-server-boilerplate",
	version: "1.0.0",
});

// Add a calculator tool
server.registerTool(
	"calculate",
	{
		title: "Calculator",
		description: "Perform basic arithmetic operations",
		inputSchema: {
			operation: z
				.enum(["add", "subtract", "multiply", "divide"])
				.describe("The operation to perform"),
			a: z.number().describe("First number"),
			b: z.number().describe("Second number"),
		},
	},
	async ({ operation, a, b }) => {
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
					return {
						content: [
							{
								type: "text",
								text: "Error: Division by zero is not allowed",
							},
						],
						isError: true,
					};
				}
				result = a / b;
				break;
		}

		return {
			content: [
				{
					type: "text",
					text: `${a} ${operation} ${b} = ${result}`,
				},
			],
			structuredContent: {
				firstNumber: a,
				secondNumber: b,
				operation: operation,
				result: result,
			},
		};
	},
);

server.registerTool(
	"your-new-tool", // change name
	{
		title: "My new tool", // change title with something relevant
		description: "Description of my new tool", // change description with a description that will help the LLM understand when to use this tool
		inputSchema: {
			myInput: z.string().describe("An input for my new tool"), // change input schema to match your tool's inputs
		},
	},
	async ({ myInput }) => {
		// implement your tool's logic here

		return {
			content: [
				{
					type: "text",
					text: `Result: ${myInput}`, // return a meaningful text result
				},
			],
			structuredContent: {
				myInput: myInput, // return structured content if applicable
			},
		};
	},
);

server.registerTool(
	"movies",
	{
		title: "Movies",
		description: "Get a list of movies",
		inputSchema: {
			title: z.string().describe("The title of the movie to search for"),
		},
	},
	async ({ title }) => {
		const response = await fetch(
			`https://imdb.iamidiotareyoutoo.com/search?q=${title}`,
		);
		const data = await response.json();

		return {
			content: [
				{
					type: "text",
					text: `Here are some matching movies: ${JSON.stringify(data)}`,
				},
			],
			structuredContent: data,
		};
	},
);

// Set up Express server with HTTP transport
const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
	try {
		// Create a new transport for each request
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
			enableJsonResponse: true,
		});

		res.on("close", () => {
			transport.close();
		});

		await server.connect(transport);
		await transport.handleRequest(req, res, req.body);
	} catch (error) {
		console.error("Error handling MCP request:", error);
		if (!res.headersSent) {
			res.status(500).json({
				jsonrpc: "2.0",
				error: {
					code: -32603,
					message: "Internal server error",
				},
				id: null,
			});
		}
	}
});

const PORT = parseInt(process.env.PORT || "3000");
app
	.listen(PORT, () => {
		console.log(`MCP Server running on http://localhost:${PORT}/mcp`);
	})
	.on("error", (error) => {
		console.error("Server error:", error);
		process.exit(1);
	});
