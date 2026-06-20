import server from "../dist/server/index.js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const worker = server?.default ?? server;
const fetcher = worker.fetch?.bind(worker) ?? worker;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(__dirname, "..", "public");
function getContentType(ext) {
  switch (ext.toLowerCase()) {
    case ".js":
      return "application/javascript; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".ico":
      return "image/x-icon";
    case ".woff":
      return "font/woff";
    case ".woff2":
      return "font/woff2";
    case ".ttf":
      return "font/ttf";
    default:
      return "application/octet-stream";
  }
}
async function tryServeStaticAsset(pathname) {
  const normalized = path.normalize(pathname);
  const filePath = path.join(publicRoot, normalized.startsWith("/") ? normalized.slice(1) : normalized);
  if (!filePath.startsWith(publicRoot)) return null;
  try {
    const data = await readFile(filePath);
    const ext = path.extname(filePath);
    return new Response(data, {
      status: 200,
      headers: {
        "content-type": getContentType(ext),
      },
    });
  } catch {
    return null;
  }
}
export default async function handler(req, res) {
  const host = req.headers.host ?? "localhost";
  const protocol = (req.headers["x-forwarded-proto"] || "https").toString();
  const url = new URL(req.url ?? "/", `${protocol}://${host}`);
  if (req.method === "GET" || req.method === "HEAD") {
    const staticResponse = await tryServeStaticAsset(url.pathname);
    if (staticResponse) {
      res.statusCode = staticResponse.status;
      staticResponse.headers.forEach((value, key) => {
        if (key.toLowerCase() === "transfer-encoding") return;
        res.setHeader(key, value);
      });
      const buffer = Buffer.from(await staticResponse.arrayBuffer());
      res.end(buffer);
      return;
    }
  }
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
    } else {
      headers.set(key, value);
    }
  }
  const request = new Request(url.toString(), {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method ?? "GET") ? null : req,
  });
  const response = await fetcher(request, {}, {});
  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    res.setHeader(key, value);
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  res.end(buffer);
}