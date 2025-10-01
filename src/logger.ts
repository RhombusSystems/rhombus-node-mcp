import log4js from "log4js";
import path from "path";

log4js.configure({
  appenders: {
    mcp: {
      type: "file",
      filename: path.resolve(process.env.LOG_FOLDER ?? process.cwd(), "./logs/rhombus-node-mcp.log"),
      maxLogSize: "1M",
      layout: {
        type: "basic",
      },
    },
    stderr: { type: "stderr" },
    stdout: { type: "stdout" },
  },
  categories: {
    default: {
      appenders: ["mcp", "stdout"],
      level: "trace",
    },
    mcp: {
      appenders: ["mcp", "stdout"],
      level: "trace",
    },
  },
});

export const getLogger = log4js.getLogger;
export const logger = log4js.getLogger("mcp");
