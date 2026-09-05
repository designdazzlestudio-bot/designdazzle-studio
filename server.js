"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const chatHandler = require("./api/chat");

const ROOT = __dirname;

function loadEnvFile() {
  const file = path.join(ROOT, ".env");
  if (!fs.existsSync(file)) return;

  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const clean = line.trim();
    if (!clean || clean.startsWith("#")) continue;
    const match = clean.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile();

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(data));
}

function safePath(urlPath) {
  let decoded;
  try { decoded = decodeURIComponent((urlPath || "/").split("?")[0]); }
  catch (_) { return null; }
  if (decoded.includes("\0")) return null;

  let clean = path.normalize(decoded);
  if (clean === "/" || clean === ".") clean = "/index.html";
  if (clean.endsWith("/")) clean += "index.html";

  const rootPath = path.resolve(ROOT);
  const full = path.resolve(ROOT, "." + clean);
  return full.startsWith(rootPath + path.sep) || full === rootPath ? full : null;
}

function serveStatic(req, res) {
  const file = safePath(req.url);
  if (!file) return json(res, 400, { error: "Bad path." });

  fs.stat(file, (error, stat) => {
    if (error || !stat.isFile()) return json(res, 404, { error: "Not found." });
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const requestPath = (req.url || "").split("?")[0];
  if (requestPath === "/api/chat") return chatHandler(req, res);
  if (req.method === "GET" || req.method === "HEAD") return serveStatic(req, res);
  return json(res, 405, { error: "Method not allowed." });
});

server.listen(PORT, HOST, () => {
  console.log(`Design Dazzle Studio running at http://localhost:${PORT}`);
  console.log(`Dazzle AI model: ${process.env.GEMINI_MODEL || "gemini-3.5-flash-lite"}`);
  console.log(`GEMINI_API_KEY loaded: ${process.env.GEMINI_API_KEY ? "YES" : "NO"}`);
});
