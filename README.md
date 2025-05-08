# 🚀 Rhombus MCP Server - Supercharge Your AI Tools!

Unleash the power of the Rhombus API with this cutting-edge MCP server implementation! Transform your chatbot experience with advanced security and surveillance capabilities at your fingertips.

## 🔧 Quick Setup

### Step 1: Get Your Rhombus Superpowers

1. Join the Rhombus revolution - [Create your account now](https://console.rhombus.com)! 🔐
2. Generate your magic key at [API Key Settings](https://console.rhombus.com/settings/api-management) ✨
3. Activate your powers by setting `RHOMBUS_API_KEY` in your environment 💪

### Step 2: Supercharge Claude Desktop

1. Grab the incredible Claude desktop [right here](https://claude.ai/download)! 📥

2. Unleash the magic by adding this to your `claude_desktop_config.json`:

### DOCKER

```json
{
  "mcpServers": {
    "rhombus": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "RHOMBUS_API_KEY=YOUR_API_KEY_HERE",
        "mcp-server-rhombus"
      ],
      "env": {
        "RHOMBUS_API_KEY": "YOUR_API_KEY_HERE"
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
      "args": ["--yes", "--package", "rhombus-node-mcp", "mcp-server-rhombus"],
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

### Step 3: Take It For A Spin! 🎡

Time to see the magic happen! Let's verify that Claude for Desktop is detecting our awesome `rhombus` server tools:

1. Look for the powerful hammer icon in Claude's interface ⚒️
2. Click it to reveal your new arsenal of tools
3. Spot the Filesystem MCP Server tools in the list

If they're visible, YOU'VE DONE IT! 🎉 Your integration is live and ready to rock! Claude can now communicate directly with Rhombus systems, giving you the same incredible capabilities as the Rhombus web app, but with the added power of Claude's intelligence!

### Hitting a Snag? We've Got You! 🛟

Check out Claude's fantastic [troubleshooting guide](https://modelcontextprotocol.io/docs/tools/debugging) for quick fixes! Still stuck? Our team of experts is ready to help!

* Email us: developer@rhombus.com 📧
* [Report a bug](https://github.com/ppl-ai/api-discussion/issues) and help us improve 🐛

We're committed to making your experience absolutely seamless!

## 📜 License

This awesome MCP server comes with the freedom of the MIT License! ✅ Use it, ✅ modify it, ✅ share it - the possibilities are endless! Just remember to follow the MIT License terms and conditions. Check out the LICENSE file in our repository for all the details.
