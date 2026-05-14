const http = require('http');

const PORT = process.env.PORT || 3000;
const APP  = process.env.OTEL_SERVICE_NAME || 'acme';
const ENV  = process.env.DEPLOYMENT_ENV || 'dev';
const GREETING = process.env.GREETING || 'Hello world';

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  const words = GREETING.trim().split(/\s+/).map(escapeHtml);
  const headline = words
    .map((w, i) => `<span style="animation-delay:${i * 180}ms">${w}</span>`)
    .join('');
  const title = escapeHtml(GREETING);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  html, body {
    height: 100%;
    margin: 0;
    background: #ffffff;
    overflow: hidden;
  }
  body {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #0a0a0a;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  .bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  .bg iframe {
    width: 100%;
    height: 100%;
    border: 0;
    display: block;
  }

  h1 {
    position: relative;
    z-index: 1;
    font-size: clamp(72px, 18vw, 280px);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 0.95;
    margin: 0;
    opacity: 0;
    transform: translateY(24px);
    animation: rise 900ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
  }
  h1 span {
    display: inline-block;
    opacity: 0;
    transform: translateY(40px);
    animation: word-in 700ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
  }
  h1 span + span { margin-left: 0.25em; }

  @keyframes rise    { to { opacity: 1; transform: translateY(0); } }
  @keyframes word-in { to { opacity: 1; transform: translateY(0); } }

  @media (prefers-reduced-motion: reduce) {
    h1, h1 span { animation: none; opacity: 1; transform: none; }
  }
</style>
</head>
<body>
  <div class="bg" aria-hidden="true">
    <iframe src="https://my.spline.design/crystalball-de222de54d6fc4752fa850b54fb654de/" frameborder="0" id="aura-spline"></iframe>
  </div>
  <h1>${headline}</h1>
</body>
</html>`;

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);

  console.log(JSON.stringify({ level: 'info', msg: 'request', method: req.method, path: req.url, app: APP, env: ENV }));
});

server.listen(PORT, () => {
  console.log(JSON.stringify({ level: 'info', msg: 'server started', port: PORT, app: APP, env: ENV }));
});
