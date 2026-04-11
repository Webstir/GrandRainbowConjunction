import { createRequire } from "node:module";
import path from "node:path";
import React from "react";
import { compile } from "@mdx-js/mdx";
import * as JsxDevRuntime from "react/jsx-dev-runtime";
import * as JsxRuntime from "react/jsx-runtime";
import type { Pluggable } from "unified";
import { VFile } from "vfile";
import type { MDXComponents } from "mdx/types";

/**
 * Compile MDX like next-mdx-remote RSC with `blockJS: false`.
 *
 * - In **development**, MDX uses `jsxDEV` + `Fragment` from `arguments[0]`.
 * - In **production**, MDX uses `jsx` / `jsxs`.
 *
 * We normalize `props.children` with `React.Children.toArray` on every MDX
 * element so sibling lists get implicit keys and React stops warning.
 */
const requireFromNmdr = createRequire(
  path.join(process.cwd(), "node_modules/next-mdx-remote/dist/serialize.js")
);

const { removeImportsExportsPlugin } = requireFromNmdr(
  "./plugins/remove-imports-exports.js"
) as { removeImportsExportsPlugin: Pluggable };

const { CreateRemoveDangerousCallsPlugin } = requireFromNmdr(
  "./plugins/remove-dangerous-javascript-expressions.js"
) as { CreateRemoveDangerousCallsPlugin: (...args: unknown[]) => Pluggable };

type MdxContentProps = { components?: MDXComponents };

const mdxDevelopment = process.env.NODE_ENV !== "production";

function normalizeChildrenProps(
  props: object | null | undefined
): object | null | undefined {
  if (props == null) return props;
  const p = props as { children?: React.ReactNode };
  if (p.children === undefined || p.children === null) return props;
  return { ...p, children: React.Children.toArray(p.children) };
}

function createMdxEvalRuntime(): Record<string, unknown> {
  if (mdxDevelopment) {
    return {
      Fragment: JsxDevRuntime.Fragment,
      jsxDEV(
        type: React.ElementType,
        props: unknown,
        key: React.Key | undefined,
        isStaticChildren: boolean,
        source?: JsxDevRuntime.JSXSource,
        self?: unknown
      ) {
        const p =
          props !== null && typeof props === "object"
            ? normalizeChildrenProps(props as object)
            : props;
        return JsxDevRuntime.jsxDEV(
          type,
          p,
          key,
          isStaticChildren,
          source,
          self
        );
      },
    };
  }
  return {
    Fragment: JsxRuntime.Fragment,
    jsx(type: React.ElementType, props: object, key: React.Key | undefined) {
      return JsxRuntime.jsx(
        type,
        normalizeChildrenProps(props) as object,
        key
      );
    },
    jsxs(type: React.ElementType, props: object, key: React.Key | undefined) {
      return JsxRuntime.jsxs(
        type,
        normalizeChildrenProps(props) as object,
        key
      );
    },
  };
}

export async function compileMdxSection(
  source: string,
  components: MDXComponents
): Promise<React.ReactElement> {
  const jsxRuntime = createMdxEvalRuntime();
  const vfile = new VFile(source);
  const compiled = await compile(vfile, {
    remarkPlugins: [
      removeImportsExportsPlugin,
      CreateRemoveDangerousCallsPlugin(),
    ],
    outputFormat: "function-body",
    providerImportSource: undefined,
    development: mdxDevelopment,
  });
  const compiledSource = String(compiled);
  const fullScope = Object.assign({ opts: jsxRuntime }, { frontmatter: {} });
  const keys = Object.keys(fullScope);
  const values = Object.values(fullScope);
  const hydrateFn = Reflect.construct(
    Function,
    keys.concat(compiledSource) as unknown as string[]
  ) as (...args: unknown[]) => { default: React.ComponentType<MdxContentProps> };
  const Content = hydrateFn.apply(hydrateFn, values).default;
  return React.createElement(Content, { components });
}
