#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function addRoute(routePath) {
  const routesFile = "src/lib/variables/routes.ts";

  // Check if routes file exists
  if (!fs.existsSync(routesFile)) {
    console.error(`Error: Routes file '${routesFile}' not found`);
    process.exit(1);
  }

  // Clean and parse the path
  const cleanPath = routePath.replace(/^\/+/, ""); // Remove leading slashes
  const pathParts = cleanPath.split("/").filter((part) => part.length > 0);

  // Remove src/app if present
  const filteredParts =
    pathParts[0] === "src" && pathParts[1] === "app"
      ? pathParts.slice(2)
      : pathParts;

  // Filter out route groups like (foo)
  const finalParts = filteredParts.filter(
    (part) => !(part.startsWith("(") && part.endsWith(")")),
  );

  if (finalParts.length === 0) {
    console.error("Error: No valid path parts after filtering");
    process.exit(1);
  }

  const finalPath = "/" + finalParts.join("/");

  // Read and parse existing routes
  const fileContent = fs.readFileSync(routesFile, "utf8");
  const routesMatch = fileContent.match(/const routes = ({[\s\S]*?}) as const/);

  let existingRoutes = {};
  if (routesMatch) {
    try {
      existingRoutes = parseRoutesObject(routesMatch[1]);
    } catch (e) {
      console.log("Warning: Could not parse existing routes, starting fresh");
      console.log("Error:", e.message);
      existingRoutes = {};
    }
  }

  // Add new route to existing structure
  addRouteToObject(existingRoutes, finalParts, finalPath);

  console.log(existingRoutes);

  // Convert back to TypeScript format
  const newRoutesStr = toTypeScriptObject(existingRoutes);
  const newContent = fileContent.replace(
    /const routes = {[\s\S]*?} as const/,
    `const routes = ${newRoutesStr} as const`,
  );

  // Write back to file
  fs.writeFileSync(routesFile, newContent);
  console.log(`✓ Route '${finalPath}' added successfully to ${routesFile}`);
}

function parseRoutesObject(routesStr) {
  // Store function expressions separately to preserve them
  const functionMap = new Map();
  let functionCounter = 0;

  // Extract and temporarily replace function expressions
  let processedStr = routesStr.replace(
    /(\w+):\s*\([^)]*\)\s*=>\s*`[^`]*(?:\$\{[^}]*\}[^`]*)*`/g,
    (match, key) => {
      const functionId = `__FUNCTION_${functionCounter++}__`;
      functionMap.set(functionId, match.substring(key.length + 1).trim()); // Store without the key
      return `${key}: "${functionId}"`;
    },
  );

  // Convert TypeScript object syntax to valid JSON
  processedStr = processedStr
    .replace(/(\w+)(\s*):/g, '"$1"$2:') // Quote unquoted keys
    .replace(/'/g, '"') // Convert single quotes to double
    .replace(/,(\s*[}\]])/g, "$1"); // Remove trailing commas

  // Parse as JSON
  const parsed = JSON.parse(processedStr);

  // Restore function expressions
  function restoreFunctions(obj) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string" && functionMap.has(value)) {
        obj[key] = { __isFunction: true, code: functionMap.get(value) };
      } else if (typeof value === "object" && value !== null) {
        restoreFunctions(value);
      }
    }
  }

  restoreFunctions(parsed);
  return parsed;
}

function addRouteToObject(obj, pathArray, fullPath) {
  let current = obj;

  for (let i = 0; i < pathArray.length; i++) {
    const key = pathArray[i];
    const isLast = i === pathArray.length - 1;

    // Check if this is a dynamic route segment like [:fooId]
    const isDynamic =
      key.startsWith("[") && key.endsWith("]") && key.includes(":");

    if (isDynamic) {
      // Extract parameter name from [:fooId] -> fooId
      const paramName = key.slice(2, -1); // Remove [: and ]
      const paramKey = paramName.replace(/Id$/, ""); // Remove 'Id' suffix if present

      // Create nested object if it doesn't exist
      if (!current[paramKey]) {
        current[paramKey] = {};
      }

      // Only add page property if it doesn't exist (never override)
      if (!current[paramKey].page) {
        const pathTemplate = fullPath.replace(
          `[${key.slice(1, -1)}]`,
          "${" + paramName + "}",
        );
        current[paramKey].page = {
          __isFunction: true,
          code: `(${paramName}: string) => \`${pathTemplate}\``,
        };
      }
    } else {
      // Regular static route handling
      if (!current[key]) {
        current[key] = {};
      }

      // Only add page property if it doesn't exist and this is the last element
      if (isLast && !current[key].page) {
        current[key].page = fullPath;
      }

      // Move to next level for further nesting
      current = current[key];
    }
  }
}

function toTypeScriptObject(obj, indent = "") {
  if (typeof obj !== "object" || obj === null) {
    return JSON.stringify(obj);
  }

  // Handle function objects
  if (obj.__isFunction) {
    return obj.code;
  }

  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return "{}";
  }

  const nextIndent = indent + "  ";
  const lines = entries.map(([key, value]) => {
    const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
    const valueStr = toTypeScriptObject(value, nextIndent);
    return `${nextIndent}${keyStr}: ${valueStr}`;
  });

  return `{\n${lines.join(",\n")}\n${indent}}`;
}

// Main execution
if (require.main === module) {
  const routePath = process.argv[2];

  if (!routePath) {
    console.error("Usage: node add-route.js <route-path>");
    console.error('Example: node add-route.js "/src/app/users/[:userId]"');
    process.exit(1);
  }

  addRoute(routePath);
}
