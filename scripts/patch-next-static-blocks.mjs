#!/usr/bin/env node
/**
 * patch-next-static-blocks.mjs
 *
 * Next.js 16's client components (error-boundary.js, catch-error.js) use
 * class static initialization blocks:
 *
 *   class Foo extends Component {
 *     static { this.contextType = AppRouterContext; }
 *   }
 *
 * This syntax requires Safari 16.4+. iOS 16.1 (Safari 16.1) can't parse it,
 * causing "SyntaxError: Unexpected token '{'" and killing the entire app.
 *
 * Since these files are pre-compiled inside the `next` npm package, no
 * browserslist or Turbopack config will re-transpile them. This script
 * rewrites the static blocks into equivalent post-class assignments:
 *
 *   class Foo extends Component { }
 *   Foo.contextType = AppRouterContext;
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const files = [
  "node_modules/next/dist/client/components/error-boundary.js",
  "node_modules/next/dist/client/components/catch-error.js",
  "node_modules/next/dist/esm/client/components/error-boundary.js",
  "node_modules/next/dist/esm/client/components/catch-error.js",
];

/**
 * Replace `static{ this.X = Y; }` blocks inside a class body with a
 * post-class assignment `ClassName.X = Y;`.
 *
 * Also handles the DevTools display-name pattern:
 *   static{ this.displayName = "..."; }
 */
function patchFile(relPath) {
  const abs = join(root, relPath);
  if (!existsSync(abs)) {
    console.log(`  skip (not found): ${relPath}`);
    return;
  }

  let src = readFileSync(abs, "utf8");
  if (!src.includes("static{")) {
    console.log(`  skip (no static blocks): ${relPath}`);
    return;
  }

  // Collect class names so we can append assignments after the class closes.
  // Strategy: find each `class X ... { ... static{ this.prop = val; } ... }`
  // and move the assignment out.

  // Match: static{\n        this.PROP = EXPR;\n    }
  // Also match single-line: static{this.PROP=EXPR}
  // We also handle the comment-only static blocks (DevTools label).
  const staticBlockRe =
    /(\bclass\s+(\w+)[^{]*\{[\s\S]*?)static\s*\{[\s\n]*(\/\/[^\n]*)?\s*this\.(\w+)\s*=\s*([^;]+);\s*\}/;

  let iterations = 0;
  const postAssignments = [];

  while (staticBlockRe.test(src) && iterations < 20) {
    iterations++;
    src = src.replace(staticBlockRe, (match, before, className, comment, prop, value) => {
      postAssignments.push({ className, prop, value, comment });
      // Remove the static block, keep everything before it
      return before;
    });
  }

  // Also handle static blocks that only contain a comment (no assignment)
  const commentOnlyRe = /static\s*\{\s*\/\/[^}]*\}/g;
  src = src.replace(commentOnlyRe, "/* static block removed for Safari 16.1 compat */");

  // Now append the assignments. We need to find the right spot — after each
  // class declaration closes. For simplicity, append all at the end of the
  // module (they reference the class name, so order doesn't matter as long
  // as it's after the class definition).
  if (postAssignments.length > 0) {
    const lines = postAssignments.map(({ className, prop, value, comment }) => {
      const c = comment ? `  ${comment}\n` : "";
      return `${c}${className}.${prop} = ${value};`;
    });
    src += "\n// [patched] static blocks moved for Safari <16.4 compat\n";
    src += lines.join("\n") + "\n";
  }

  writeFileSync(abs, src, "utf8");
  console.log(`  patched: ${relPath} (${postAssignments.length} static blocks moved)`);
}

console.log("Patching Next.js static blocks for Safari <16.4 compat...");
for (const f of files) {
  patchFile(f);
}
console.log("Done.\n");
