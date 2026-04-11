/** @type {import('next').NextConfig} */
const nextConfig = {
  // next-mdx-remote plugins are loaded via createRequire(); ensure they exist
  // in the serverless bundle on Vercel (not only serialize.js).
  outputFileTracingIncludes: {
    "/*": ["./node_modules/next-mdx-remote/dist/plugins/**/*"],
  },
};

export default nextConfig;
