// run with `npx tsx extract-route-outputs.ts`

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OpenApiSpec {
  paths: Record<string, Record<string, Route>>;
  components: {
    schemas: Record<string, Schema>;
  };
}

interface Route {
  responses: Record<string, Response>;
}

interface Response {
  content?: {
    'application/json'?: {
      schema?: Schema;
    };
  };
}

interface Schema {
  $ref?: string;
  type?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  enum?: string[];
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  additionalProperties?: boolean | Schema;
  nullable?: boolean;
}

class OpenApiOutputExtractor {
  private openApiSpec: OpenApiSpec;
  private visitedRefs: Set<string> = new Set();

  constructor(specPath: string) {
    const specContent = fs.readFileSync(specPath, 'utf8');
    this.openApiSpec = JSON.parse(specContent);
  }

  /**
   * Resolves a $ref to the actual schema
   */
  private resolveRef(ref: string): Schema | null {
    if (this.visitedRefs.has(ref)) {
      // Circular reference detected, return null to prevent infinite recursion
      return null;
    }

    this.visitedRefs.add(ref);

    const refPath = ref.replace('#/', '').split('/');
    let current: any = this.openApiSpec;

    for (const segment of refPath) {
      if (current && typeof current === 'object' && segment in current) {
        current = current[segment];
      } else {
        this.visitedRefs.delete(ref);
        return null;
      }
    }

    const result = current as Schema;
    this.visitedRefs.delete(ref);
    return result;
  }

  /**
   * Extracts leaf nodes from a schema
   */
  private extractLeafNodes(schema: Schema, visited: Set<string> = new Set()): string[] {
    if (!schema) return [];

    // Handle $ref
    if (schema.$ref) {
      if (visited.has(schema.$ref)) {
        // Circular reference, return empty array
        return [];
      }
      
      visited.add(schema.$ref);
      const resolvedSchema = this.resolveRef(schema.$ref);
      const result = resolvedSchema ? this.extractLeafNodes(resolvedSchema, visited) : [];
      visited.delete(schema.$ref);
      return result;
    }

    // Handle properties (object type)
    if (schema.properties) {
      const leafNodes: string[] = [];
      for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
        const childLeaves = this.extractLeafNodes(propertySchema, visited);
        if (childLeaves.length === 0) {
          // This is a leaf node
          leafNodes.push(propertyName);
        } else {
          // This has children, add the children
          leafNodes.push(...childLeaves);
        }
      }
      return leafNodes;
    }

    // Handle array type
    if (schema.type === 'array' && schema.items) {
      return this.extractLeafNodes(schema.items, visited);
    }

    // Handle allOf, oneOf, anyOf
    if (schema.allOf) {
      const allLeaves: string[] = [];
      for (const subSchema of schema.allOf) {
        allLeaves.push(...this.extractLeafNodes(subSchema, visited));
      }
      return allLeaves;
    }

    if (schema.oneOf) {
      const allLeaves: string[] = [];
      for (const subSchema of schema.oneOf) {
        allLeaves.push(...this.extractLeafNodes(subSchema, visited));
      }
      return allLeaves;
    }

    if (schema.anyOf) {
      const allLeaves: string[] = [];
      for (const subSchema of schema.anyOf) {
        allLeaves.push(...this.extractLeafNodes(subSchema, visited));
      }
      return allLeaves;
    }

    // Handle additionalProperties
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      return this.extractLeafNodes(schema.additionalProperties, visited);
    }

    // For primitive types or enums, return empty array (no properties to extract)
    return [];
  }

  /**
   * Extracts output keys from a single route
   */
  private extractOutputKeysFromRoute(route: Route): string[] {
    const outputKeys: string[] = [];

    for (const [statusCode, response] of Object.entries(route.responses)) {
      if (response.content?.['application/json']?.schema) {
        const schema = response.content['application/json'].schema;
        const leafNodes = this.extractLeafNodes(schema);
        outputKeys.push(...leafNodes);
      }
    }

    // Remove duplicates and sort
    return [...new Set(outputKeys)].sort();
  }

  /**
   * Extracts output keys from all routes
   */
  public extractAllRouteOutputs(): Record<string, string[]> {
    const routeOutputs: Record<string, string[]> = {};

    for (const [routePath, methods] of Object.entries(this.openApiSpec.paths)) {
      for (const [method, route] of Object.entries(methods)) {
        const routeKey = `${method.toUpperCase()} ${routePath}`;
        const outputKeys = this.extractOutputKeysFromRoute(route);
        
        if (outputKeys.length > 0) {
          routeOutputs[routeKey] = outputKeys;
        }
      }
    }

    return routeOutputs;
  }

  /**
   * Saves the extracted outputs to a JSON file
   */
  public saveToFile(outputPath: string): void {
    const routeOutputs = this.extractAllRouteOutputs();
    
    const outputData = {
      timestamp: new Date().toISOString(),
      totalRoutes: Object.keys(routeOutputs).length,
      routes: routeOutputs
    };

    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`Extracted output keys for ${Object.keys(routeOutputs).length} routes`);
    console.log(`Results saved to: ${outputPath}`);
  }
}

// Main execution
function main() {
  try {
    const specPath = path.join(__dirname, 'openapi.json');
    const outputPath = path.join(__dirname, 'routes-to-output-keys.json');

    console.log('Starting route output extraction...');
    console.log(`Reading OpenAPI spec from: ${specPath}`);

    const extractor = new OpenApiOutputExtractor(specPath);
    extractor.saveToFile(outputPath);

    console.log('Route output extraction completed successfully!');
  } catch (error) {
    console.error('Error during extraction:', error);
    process.exit(1);
  }
}

// Run the script
main();

export { OpenApiOutputExtractor };
