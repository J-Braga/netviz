import { serve } from "bun";

const PORT = 3000;

const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve `index.html`
    if (url.pathname === "/") {
      return new Response(Bun.file("public/index.html"));
    }

    // Serve static files (JS, CSS, etc.)
    try {
      return new Response(Bun.file(`public${url.pathname}`));
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },
});

console.log(`🚀 Server running at http://localhost:${PORT}`);
