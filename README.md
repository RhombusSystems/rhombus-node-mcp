# Rhombus MCP Server

An MCP server implementation that integrates the Rhombus API to provide Chatbot tools.

## Configuration

### Step 1: Get a Rhombus API Key

1. Sign up for a [Rhombus Account](https://console.rhombus.com).
2. Create an API Key at [API Key Settings](https://console.rhombus.com/settings/api-management)
3. Set the API key in your environment as `RHOMBUS_API_KEY`.

### Step 2: Configure Claude Desktop

1. Download Claude desktop [here](https://claude.ai/download).

2. Add this to your `claude_desktop_config.json`:

### DOCKER

```json
{
  "mcpServers": {
    "rhombus": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "RHOMBUS_API_KEY", "mcp-server-rhombus"],
      "env": {
        "RHOMBUS_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### NPX

```json
{
  "mcpServers": {
    "rhombus": {
      "command": "npx",
      "args": ["-y", "server-rhombus"],
      "env": {
        "RHOMBUS_API_KEY": "YOUR_API_KEY_HERE"
      }
    }
  }
}
```

You can access the file using:

```bash
vim ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

### Step 3: Testing

Let's make sure Claude for Desktop is picking up the tools we've exposed in our `rhombus` server. You can do this by looking for the hammer icon.

After clicking on the hammer icon, you should see the tools that come with the Filesystem MCP Server:

If you see both of these this means that the integration is active. Congratulations! This means Claude can now ask Rhombus questions. You can then simply use it as you would use the Rhombus web app.

### Troubleshooting

The Claude documentation provides an excellent [troubleshooting guide](https://modelcontextprotocol.io/docs/tools/debugging) you can refer to. However, you can still reach out to us at api@rhombus.com for any additional support or [file a bug](https://github.com/ppl-ai/api-discussion/issues).

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.
