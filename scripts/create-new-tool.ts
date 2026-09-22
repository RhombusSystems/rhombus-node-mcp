import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

const filePathName = new URL(".", import.meta.url).pathname;

const toolFile = path.resolve(filePathName, "../templates/template-tool.ts");
const toolApiFile = path.resolve(filePathName, "../templates/template-tool-api.ts");
const toolTypesFile = path.resolve(filePathName, "../templates/template-tool-types.ts");

console.log("Welcome to our tool creation script!");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const toolName: string = await new Promise(resolve =>
  rl.question("Please enter the name of the tool you want to create (i.e. 'users-tool'): ", resolve)
);

console.log(`Creating tool '${toolName}'...`);

rl.close();

// read template files
const toolFileContents = fs.readFileSync(toolFile, "utf8");
const toolApiFileContents = fs.readFileSync(toolApiFile, "utf8");
const toolTypesFileContents = fs.readFileSync(toolTypesFile, "utf8");

// replace tool name occurances
const newToolFileContents = toolFileContents.replaceAll("NEW_TOOL_NAME", toolName);
const newToolApiFileContents = toolApiFileContents.replaceAll("NEW_TOOL_NAME", toolName);
const newToolTypesFileContents = toolTypesFileContents.replaceAll("NEW_TOOL_NAME", toolName);

// write new files
const toolFileDest = path.resolve(filePathName, "../src/tools", `${toolName}.ts`);
const toolApiFileDest = path.resolve(filePathName, "../src/api", `${toolName}-api.ts`);
const toolTypesFileDest = path.resolve(filePathName, "../src/types", `${toolName}-types.ts`);

fs.writeFileSync(toolFileDest, newToolFileContents);
fs.writeFileSync(toolApiFileDest, newToolApiFileContents);
fs.writeFileSync(toolTypesFileDest, newToolTypesFileContents);

// done!
console.log(`Tool file created at: ${toolFileDest}`);
console.log(`Tool API file created at: ${toolApiFileDest}`);
console.log(`Tool types file created at: ${toolTypesFileDest}`);
console.log('\n');
console.log(`Tool '${toolName}' created successfully!`);