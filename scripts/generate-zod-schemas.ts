#!/usr/bin/env node
/**
 * Custom script to generate Zod schemas from OpenAPI spec
 * This is a workaround for openapi-zod-client compatibility issues with large specs
 *
 * CURRENT LIMITATIONS:
 * - API client generation is disabled due to complex circular dependencies
 * - Some schemas use z.lazy() to handle self-references
 * - Endpoint definitions are commented out to avoid TypeScript complexity errors
 *
 * To regenerate schemas: npm run generate-schemas
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OpenApiSpec {
  openapi: string;
  info: any;
  servers?: any[];
  paths: Record<string, any>;
  components?: {
    schemas?: Record<string, any>;
    parameters?: Record<string, any>;
    responses?: Record<string, any>;
  };
}

class ZodSchemaGenerator {
  private spec: OpenApiSpec;
  private generatedSchemas = new Set<string>();
  private schemaDependencies = new Map<string, Set<string>>();
  private schemaDefinitions = new Map<string, any>();

  constructor(specPath: string) {
    const specContent = fs.readFileSync(specPath, "utf8");
    this.spec = JSON.parse(specContent);
  }

  private convertType(schema: any, name?: string, currentPath: string[] = []): string {
    if (!schema) return "z.unknown()";

    // Handle $ref
    if (schema.$ref) {
      const refName = schema.$ref.split("/").pop();
      if (refName) {
        // Check for circular reference
        if (currentPath.includes(refName)) {
          return `z.lazy(() => ${refName})`;
        }
        // Check if this is a forward reference (not yet generated)
        if (!this.generatedSchemas.has(refName) && this.schemaDefinitions.has(refName)) {
          return `z.lazy(() => ${refName})`;
        }
        return refName;
      }
      return "z.unknown()";
    }

    // Handle basic types
    switch (schema.type) {
      case "string":
        let stringSchema = "z.string()";
        if (schema.format === "date-time") stringSchema += ".datetime({ offset: true })";
        if (schema.format === "email") stringSchema += ".email()";
        if (schema.format === "uuid") stringSchema += ".uuid()";
        if (schema.minLength !== undefined) stringSchema += `.min(${schema.minLength})`;
        if (schema.maxLength !== undefined) stringSchema += `.max(${schema.maxLength})`;
        if (schema.pattern) stringSchema += `.regex(/${schema.pattern}/)`;
        return stringSchema;

      case "number":
      case "integer":
        let numberSchema = schema.type === "integer" ? "z.number().int()" : "z.number()";
        if (schema.minimum !== undefined) numberSchema += `.min(${schema.minimum})`;
        if (schema.maximum !== undefined) numberSchema += `.max(${schema.maximum})`;
        return numberSchema;

      case "boolean":
        return "z.boolean()";

      case "array":
        const itemType = this.convertType(schema.items, undefined, currentPath);
        return `z.array(${itemType})`;

      case "object":
        if (schema.properties) {
          const properties: string[] = [];
          const required = schema.required || [];
          const newPath = name ? [...currentPath, name] : currentPath;

          for (const [propName, propSchema] of Object.entries(schema.properties)) {
            let propType = this.convertType(propSchema as any, propName, newPath);
            if (!required.includes(propName)) {
              propType += ".optional()";
            }
            // Handle property names with hyphens or other special characters
            const safePropName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(propName)
              ? propName
              : `"${propName}"`;
            properties.push(`  ${safePropName}: ${propType}`);
          }

          return `z.object({\n${properties.join(",\n")}\n})`;
        }
        return "z.record(z.unknown())";

      default:
        // Handle enum
        if (schema.enum) {
          const enumValues = schema.enum.map((v: any) => `"${v}"`).join(", ");
          return `z.enum([${enumValues}])`;
        }

        // Handle allOf, oneOf, anyOf
        if (schema.allOf) {
          // For simplicity, just merge the first object schema found
          for (const subSchema of schema.allOf) {
            if (subSchema.type === "object" || subSchema.properties) {
              return this.convertType(subSchema, undefined, currentPath);
            }
          }
        }

        if (schema.oneOf || schema.anyOf) {
          const unionSchemas = (schema.oneOf || schema.anyOf).map((s: any) => this.convertType(s, undefined, currentPath));
          return `z.union([${unionSchemas.join(", ")}])`;
        }

        return "z.unknown()";
    }
  }

  private analyzeDependencies() {
    if (!this.spec.components?.schemas) return;

    // First pass: collect all schema definitions and dependencies
    for (const [schemaName, schemaDefn] of Object.entries(this.spec.components.schemas)) {
      this.schemaDefinitions.set(schemaName, schemaDefn);
      this.schemaDependencies.set(schemaName, new Set());
      this.findDependencies(schemaDefn, this.schemaDependencies.get(schemaName)!);
    }
  }

  private findDependencies(schema: any, dependencies: Set<string>) {
    if (!schema || typeof schema !== "object") return;

    if (schema.$ref) {
      const refName = schema.$ref.split("/").pop();
      if (refName) dependencies.add(refName);
      return;
    }

    if (schema.properties) {
      for (const prop of Object.values(schema.properties)) {
        this.findDependencies(prop, dependencies);
      }
    }

    if (schema.items) {
      this.findDependencies(schema.items, dependencies);
    }

    if (schema.allOf) {
      for (const item of schema.allOf) {
        this.findDependencies(item, dependencies);
      }
    }

    if (schema.oneOf) {
      for (const item of schema.oneOf) {
        this.findDependencies(item, dependencies);
      }
    }

    if (schema.anyOf) {
      for (const item of schema.anyOf) {
        this.findDependencies(item, dependencies);
      }
    }
  }

  private hasCircularReference(schema: any, schemaName: string, visited: Set<string> = new Set()): boolean {
    if (!schema || typeof schema !== "object") return false;
    
    if (visited.has(schemaName)) return true;
    visited.add(schemaName);

    if (schema.$ref) {
      const refName = schema.$ref.split("/").pop();
      if (refName && refName === schemaName) return true;
      if (refName && this.schemaDefinitions.has(refName)) {
        return this.hasCircularReference(this.schemaDefinitions.get(refName), refName, new Set(visited));
      }
    }

    if (schema.properties) {
      for (const prop of Object.values(schema.properties)) {
        if (this.hasCircularReference(prop, schemaName, new Set(visited))) return true;
      }
    }

    if (schema.items) {
      if (this.hasCircularReference(schema.items, schemaName, new Set(visited))) return true;
    }

    if (schema.allOf) {
      for (const item of schema.allOf) {
        if (this.hasCircularReference(item, schemaName, new Set(visited))) return true;
      }
    }

    if (schema.oneOf) {
      for (const item of schema.oneOf) {
        if (this.hasCircularReference(item, schemaName, new Set(visited))) return true;
      }
    }

    if (schema.anyOf) {
      for (const item of schema.anyOf) {
        if (this.hasCircularReference(item, schemaName, new Set(visited))) return true;
      }
    }

    return false;
  }

  private topologicalSort(): string[] {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const result: string[] = [];
    const circularRefs = new Set<string>();

    const visit = (node: string) => {
      if (visiting.has(node)) {
        // Circular dependency detected - mark as circular
        circularRefs.add(node);
        return;
      }
      if (visited.has(node)) {
        return;
      }

      visiting.add(node);
      const deps = this.schemaDependencies.get(node) || new Set();

      for (const dep of deps) {
        if (this.schemaDependencies.has(dep)) {
          visit(dep);
        }
      }

      visiting.delete(node);
      visited.add(node);
      result.push(node);
    };

    for (const schemaName of this.schemaDependencies.keys()) {
      visit(schemaName);
    }

    // Add circular refs at the end
    for (const circularRef of circularRefs) {
      if (!visited.has(circularRef)) {
        result.push(circularRef);
      }
    }

    return result;
  }

  private generateComponentSchemas(): string[] {
    const schemas: string[] = [];

    if (!this.spec.components?.schemas) {
      return schemas;
    }

    // Analyze dependencies and sort topologically
    this.analyzeDependencies();
    const sortedSchemas = this.topologicalSort();

    // Special handling for known problematic schemas
    const specialOrder = ['BodyPart', 'MultiPart', 'LocationType'];
    const processedSpecial = new Set<string>();
    
    // Process special order schemas first
    for (const schemaName of specialOrder) {
      if (this.schemaDefinitions.has(schemaName) && !this.generatedSchemas.has(schemaName)) {
        const schemaDefn = this.schemaDefinitions.get(schemaName);
        if (schemaDefn) {
          try {
            const zodSchema = this.convertType(schemaDefn, schemaName, [schemaName]);
            schemas.push(`const ${schemaName}: z.ZodObject<any> = ${zodSchema};`);
            this.generatedSchemas.add(schemaName);
            processedSpecial.add(schemaName);
          } catch (error) {
            console.warn(`Warning: Could not generate schema for ${schemaName}:`, error);
            schemas.push(`const ${schemaName} = z.unknown(); // Could not generate from OpenAPI`);
            this.generatedSchemas.add(schemaName);
            processedSpecial.add(schemaName);
          }
        }
      }
    }

    // Generate schemas in dependency order
    for (const schemaName of sortedSchemas) {
      if (this.generatedSchemas.has(schemaName)) continue;

      const schemaDefn = this.schemaDefinitions.get(schemaName);
      if (!schemaDefn) continue;

      try {
        const zodSchema = this.convertType(schemaDefn, schemaName, [schemaName]);
        // Add explicit type annotation for schemas that might have circular references
        if (this.hasCircularReference(schemaDefn, schemaName)) {
          schemas.push(`const ${schemaName}: z.ZodObject<any> = ${zodSchema};`);
        } else {
          schemas.push(`const ${schemaName} = ${zodSchema};`);
        }
        this.generatedSchemas.add(schemaName);
      } catch (error) {
        console.warn(`Warning: Could not generate schema for ${schemaName}:`, error);
        schemas.push(`const ${schemaName} = z.unknown(); // Could not generate from OpenAPI`);
        this.generatedSchemas.add(schemaName);
      }
    }

    // Add any remaining schemas that weren't in the topological sort (circular deps)
    for (const [schemaName, schemaDefn] of Object.entries(this.spec.components.schemas)) {
      if (this.generatedSchemas.has(schemaName)) continue;

      try {
        // For circular dependencies, use z.lazy() and add explicit type annotation
        schemas.push(
          `const ${schemaName}: z.ZodLazy<z.ZodObject<any>> = z.lazy(() => ${this.convertType(schemaDefn, schemaName, [schemaName])});`
        );
        this.generatedSchemas.add(schemaName);
      } catch (error) {
        console.warn(`Warning: Could not generate schema for ${schemaName}:`, error);
        schemas.push(`const ${schemaName} = z.unknown(); // Could not generate from OpenAPI`);
        this.generatedSchemas.add(schemaName);
      }
    }

    return schemas;
  }

  private generateEndpoints(): string {
    const endpoints: string[] = [];

    for (const [path, pathItem] of Object.entries(this.spec.paths)) {
      for (const [method, operation] of Object.entries(pathItem)) {
        if (!operation || typeof operation !== "object" || !operation.responses) continue;

        try {
          const zodPath = path.replace(/{([^}]+)}/g, ":$1");

          // Generate basic endpoint structure
          const endpoint = {
            method: method.toLowerCase(),
            path: zodPath,
            requestFormat: "json" as const,
            response: "z.unknown()", // Default response
            parameters: [] as any[],
          };

          // Try to determine response type from 200 response
          const responses = operation.responses;
          if (responses["200"]?.content?.["application/json"]?.schema) {
            const responseSchema = responses["200"].content["application/json"].schema;
            endpoint.response = this.convertType(responseSchema, undefined, []);
          } else if (responses["201"]?.content?.["application/json"]?.schema) {
            const responseSchema = responses["201"].content["application/json"].schema;
            endpoint.response = this.convertType(responseSchema, undefined, []);
          }

          // Handle path parameters
          if (operation.parameters) {
            for (const param of operation.parameters) {
              if (param.in === "path") {
                endpoint.parameters.push({
                  name: param.name,
                  type: "Path",
                  schema: this.convertType(param.schema, undefined, []),
                });
              } else if (param.in === "query") {
                endpoint.parameters.push({
                  name: param.name,
                  type: "Query",
                  schema: this.convertType(param.schema, undefined, []),
                });
              }
            }
          }

          // Handle request body
          if (operation.requestBody?.content?.["application/json"]?.schema) {
            const bodySchema = operation.requestBody.content["application/json"].schema;
            endpoint.parameters.push({
              name: "body",
              type: "Body",
              schema: this.convertType(bodySchema, undefined, []),
            });
          }

          // Manually construct the endpoint string with proper quoting
          const parametersStr =
            endpoint.parameters.length > 0
              ? `,\n    parameters: [\n${endpoint.parameters
                  .map(
                    p =>
                      `      {\n        name: "${p.name}",\n        type: "${p.type}",\n        schema: ${p.schema}\n      }`
                  )
                  .join(",\n")}\n    ]`
              : "";

          const endpointStr = `    {
      method: "${endpoint.method}",
      path: "${endpoint.path}",
      requestFormat: "${endpoint.requestFormat}",
      response: ${endpoint.response}${parametersStr}
    }`;

          endpoints.push(endpointStr);
        } catch (error) {
          console.warn(
            `Warning: Could not generate endpoint for ${method.toUpperCase()} ${path}:`,
            error
          );
        }
      }
    }

    return `const endpoints = makeApi([\n${endpoints.join(",\n")}\n]);`;
  }

  public generate(): string {
    console.log("Generating Zod schemas...");

    const imports = [
      'import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";',
      'import { z } from "zod";',
      "",
    ];

    const componentSchemas = this.generateComponentSchemas();
    const endpoints = this.generateEndpoints();

    const schemaExports = Array.from(this.generatedSchemas)
      .map(name => `  ${name}`)
      .join(",\n");

    const exports = [
      "",
      "export const schemas = {",
      schemaExports,
      "};",
      "",
      "export const api = new Zodios(endpoints);",
      "",
      "export function createApiClient(baseUrl: string, options?: ZodiosOptions) {",
      "  return new Zodios(baseUrl, endpoints, options);",
      "}",
    ];

    return [
      ...imports,
      "// Auto-generated from OpenAPI spec",
      "// Some complex schemas may need manual adjustment",
      "",
      ...componentSchemas,
      "",
      "// API client generation disabled due to TypeScript complexity limits",
      "// const endpoints = makeApi([]);",
      "// export const api = new Zodios(endpoints);",
      "",
      "export const schemas = {",
      schemaExports,
      "};",
      "",
      "// export function createApiClient(baseUrl: string, options?: ZodiosOptions) {",
      "//   return new Zodios(baseUrl, endpoints, options);",
      "// }",
    ].join("\n");
  }

  public generateToFile(outputPath: string): void {
    const content = this.generate();
    fs.writeFileSync(outputPath, content, "utf8");
    console.log(`Generated Zod schemas at: ${outputPath}`);
    console.log(`Generated ${this.generatedSchemas.size} component schemas`);
  }
}

// Main execution
function main() {
  try {
    const specPath = path.join(__dirname, "../assets/openapi.json");
    const outputPath = path.join(__dirname, "../src/types/zod-schemas.ts");

    console.log("Starting custom Zod schema generation...");
    console.log(`Reading OpenAPI spec from: ${specPath}`);

    const generator = new ZodSchemaGenerator(specPath);
    generator.generateToFile(outputPath);

    console.log("Zod schema generation completed successfully!");
  } catch (error) {
    console.error("Error during generation:", error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ZodSchemaGenerator };
