/** @type {import('next').NextConfig} */
const nextConfig = {
  // @mdx-js/mdx and the next-mdx-remote plugin helpers are ESM-only packages
  // that Next.js's file tracer cannot follow automatically. List them here so
  // Vercel's serverless bundles include them on disk at runtime.
  outputFileTracingIncludes: {
    "/**": [
      "./node_modules/@mdx-js/**/*",
      "./node_modules/unified/**/*",
      "./node_modules/vfile/**/*",
      "./node_modules/vfile-message/**/*",
      "./node_modules/unist-*/**/*",
      "./node_modules/mdast-*/**/*",
      "./node_modules/hast-*/**/*",
      "./node_modules/remark-*/**/*",
      "./node_modules/rehype-*/**/*",
      "./node_modules/micromark/**/*",
      "./node_modules/micromark-*/**/*",
      "./node_modules/estree-util-*/**/*",
      "./node_modules/estree-walker/**/*",
      "./node_modules/acorn/**/*",
      "./node_modules/acorn-jsx/**/*",
    ],
  },
};

export default nextConfig;
