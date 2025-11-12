import fs from "node:fs";
import path from "node:path";
import log4js from "log4js";

const baseDir = process.env.LOG_FOLDER ?? process.cwd();
const logDir = path.resolve(baseDir, "logs");

// Attempt to create log directory, but don't fail if we can't
let fileLoggingEnabled = false;
try {
  fs.mkdirSync(logDir, { recursive: true });
  fileLoggingEnabled = true;
} catch (error) {
  // Log to stderr since we can't write to file
  console.error(`Warning: Failed to create log directory at ${logDir}: ${error}`);
}

// Build appenders configuration dynamically
const appenders: log4js.Configuration["appenders"] = {
  // stderr for terminal visibility (always available)
  stderr: { type: "stderr" },

  // only send warn+ to stderr (never stdout)
  stderrWarnPlus: {
    type: "logLevelFilter",
    appender: "stderr",
    level: "warn",
  },
};

// Only add file appender if we successfully created the directory
if (fileLoggingEnabled) {
  appenders.mcpFile = {
    type: "file",
    filename: path.join(logDir, "rhombus-node-mcp.log"),
    // prefer a number (bytes); 1 MiB:
    maxLogSize: 1 * 1024 * 1024,
    backups: 3,
    compress: true,
    layout: { type: "basic" },
  };
}

// Configure categories based on available appenders
const categories = {
  default: {
    appenders: fileLoggingEnabled ? ["mcpFile", "stderrWarnPlus"] : ["stderrWarnPlus"],
    level: "info",
  },
  mcp: {
    appenders: fileLoggingEnabled ? ["mcpFile", "stderrWarnPlus"] : ["stderrWarnPlus"],
    level: "trace",
  },
};

log4js.configure({
  appenders,
  categories,
});

export const getLogger = log4js.getLogger;
export const logger = log4js.getLogger("mcp");
