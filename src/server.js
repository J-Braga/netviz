// src/server.js
export default {
  port: 3000,
  fetch(req) {
    const url = new URL(req.url);
    let filePath = './public' + (url.pathname === '/' ? '/index.html' : url.pathname);
    
    try {
      const file = Bun.file(filePath);
      const contentType = getContentType(filePath);
      return new Response(file, {
        headers: { 'Content-Type': contentType }
      });
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
};

function getContentType(path) {
  if (path.endsWith('.html')) return 'text/html';
  if (path.endsWith('.css')) return 'text/css';
  if (path.endsWith('.js')) return 'text/javascript';
  return 'text/plain';
}
