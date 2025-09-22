# 🚀 Rhombus MCP Server - Supercharge Your AI Tools!
[![smithery badge](https://smithery.ai/badge/@RhombusSystems/rhombus-node-mcp1)](https://smithery.ai/server/@RhombusSystems/rhombus-node-mcp1)

Unleash the power of the Rhombus API with this cutting-edge MCP server implementation! Transform your chatbot experience with advanced security and surveillance capabilities at your fingertips.

## 🔍 About Rhombus

Rhombus is the #1 rated commercial security system, built to protect and designed to adapt! We deliver enterprise-grade physical security with a cybersecurity focus, combining:

* 💡 **Smart Cameras** - Innovative dome, fisheye, bullet, and multisensor security cameras
* 🚪 **Access Control** - Secure door controllers, readers, and intercoms with mobile, card, and fob access
* 📡 **IoT Sensors** - Advanced audio, environmental, motion, entry, and multipurpose panic sensors
* 🔒 **Alarm Monitoring** - TMA 5-diamond certified live agent verification and dispatch

Our platform is powered by actionable AI insights that help you respond faster with real-time detections, all while being rooted in strong cybersecurity principles.

## 🧪 Join Our Beta Test!

**We're thrilled to be part of the AI Generation!** Help us shape the future of AI-powered security by testing our MCP server implementation and providing valuable feedback.

👉 **[Fill out our beta test form here](https://rhmbs.link/beta_test)** 👈

Your insights will directly influence our development roadmap and help us create the most powerful AI security tools on the market!

## 🔧 Quick Setup

### Step 1: Give Your Rhombus Console Superpowers

1. Login to your Rhombus Console  - [Login Here](https://console.rhombus.com)! 🔐
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
        "rhombussystems/mcp-server-rhombus"
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

## 🚀 Running Locally: Unleash Your Inner Developer!

Want to get hands-on and test out the Rhombus MCP server right on your machine? Follow these steps to build and run a local Docker image, then connect it to your MCP client of choice!

### 1. Build Your Local Docker Image 🛠️
First, let's get that Docker image built. This will allow you to run the MCP server in a local environment.

```bash
npm install
docker build -t mcp-server-rhombus .
```

### 2. Update Your Claude Config for Local Use ⚡
Now, you'll need to adjust your `claude_desktop_config.json` to point to your newly built local Docker image.

> ***Note:*** When running locally, the Docker image name changes to `mcp-server-rhombus` from `rhombussystems/mcp-server-rhombus`. Make sure to update this in your configuration!

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

## Creating a new tool

We've written a script that you can run to get kickstarted on developing a new tool in addition to our existing tool set. You can simply call:

```sh
npm run create:tool
```

## Hitting a Snag? We've Got You! 🛟

Check out Claude's fantastic [troubleshooting guide](https://modelcontextprotocol.io/docs/tools/debugging) for quick fixes! Still stuck? Our team of experts is ready to help!

* Email us: developer@rhombus.com 📧
* Share your feedback via our [beta test form](https://rhmbs.link/beta_test) 🌟

We're committed to making your experience absolutely seamless and are SUPER excited to hear what amazing applications you're building with our tools!

## 🤝 We Want Your Feedback!

As pioneers in the AI Generation, we're passionate about pushing the boundaries of what's possible when combining advanced physical security with cutting-edge AI tools. Your feedback is invaluable as we continue to innovate and improve.

* What features would make your workflow even better?
* How are you using our MCP server in your projects?
* What integrations would you like to see next?

Share your thoughts, ideas, and success stories with us! Together, we're creating the future of intelligent security.

## 📜 License

This awesome MCP server comes with the freedom of the MIT License! ✅ Use it, ✅ modify it, ✅ share it - the possibilities are endless! Just remember to follow the MIT License terms and conditions. Check out the LICENSE file in our repository for all the details.
