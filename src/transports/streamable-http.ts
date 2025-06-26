import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import jwt from "jsonwebtoken";
import { IncomingMessage } from "node:http";
import createServer from "../createServer.js";
import { logger } from "../logger.js";
import { RequestModifiers } from "../util.js";

const JWT_SECRET = process.env.SECRET;

export default function streamableHttpTransport() {
  if (!JWT_SECRET) {
    throw new Error("SECRET is not set");
  }

  const app = express();
  app.use(express.json());

  app.post("/mcp", async (req, res) => {
    logger.info(`Received MCP request`, req.body);

    // check JWT
    const token = req.headers.authorization?.split(" ")[1];
    let authRequestModifiers: RequestModifiers | undefined;
    if (token) {
      try {
        const decoded = RequestModifiers.parse(jwt.verify(token, JWT_SECRET));
        // if successful (did not throw)
        authRequestModifiers = decoded;

        // inject auth into request body's meta object
        // to be made available to MCP tools
        if (req.body.params) {
          req.body.params._meta = {
            ...(req.body.params._meta ?? {}),
            requestModifiers: authRequestModifiers,
          };
        }
        logger.info(
          `🔒 MCP request authenticated with x-auth-session: ${authRequestModifiers?.headers?.["x-auth-session"]} and x-auth-chat: ${authRequestModifiers?.headers?.["x-auth-chat"]}`
        );
      } catch (err) {
        logger.error(`Error verifying JWT: ${token}, err: ${err}`);
        res.status(401).json({
          jsonrpc: "2.0",
          error: { code: -32000, message: "Unauthorized" },
          id: null,
        });
        return;
      }
    }

    const server = await createServer();
    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

      await server.connect(transport);
      await transport.handleRequest(req as IncomingMessage, res, req.body);
      res.on("close", () => {
        logger.log("Request closed");
        transport.close();
        server.close();
      });
    } catch (error) {
      logger.error("Error handling MCP request:", error);
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

  app.get("/mcp", async (req, res) => {
    logger.warn("Received Not Allowed GET MCP request");
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Method not allowed.",
        },
        id: null,
      })
    );
  });

  app.delete("/mcp", async (req, res) => {
    logger.warn("Received Not Allowed DELETE MCP request");
    res.writeHead(405).end(
      JSON.stringify({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Method not allowed.",
        },
        id: null,
      })
    );
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`rhombus-node-mcp listening on port ${PORT}`);
  });
}
