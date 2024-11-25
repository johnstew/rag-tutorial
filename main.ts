import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { generateText } from "ai";
import { ollama } from "ollama-ai-provider";
import { highlight } from "cli-highlight";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsFilePath = path.join(__dirname, "example.js");
const jsFile = await fs.readFile(jsFilePath, "utf8");

console.log("\nJavaScript code: \n");
console.log(highlight(jsFile, { language: "javascript" }));

const typesPath = path.join(__dirname, "types.d.ts");
const typesFile = await fs.readFile(typesPath, "utf8");

const system = `
    You are a TypeScript developer. Convert this JavaScript code to TypeScript.

    Only output the converted code.

    Use the types below to help you convert the code.

    ${typesFile}
`;

console.log("Converting JavaScript to TypeScript...\n");
const { text } = await generateText({
  model: ollama("qwen2.5-coder:0.5b"),
  system,
  prompt: jsFile,
});

const trimmedText = text.replace(/```(typescript|javascript)|```/g, "").trim();

console.log("TypeScript code: \n");
console.log(highlight(trimmedText, { language: "typescript" }));
