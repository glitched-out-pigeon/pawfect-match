import { cp, mkdir, readdir } from "node:fs/promises";
import { join } from "node:path";
const srcDir = join(process.cwd(), "dist", "client");
const destDir = join(process.cwd(), "public");
await mkdir(destDir, { recursive: true });
const entries = await readdir(srcDir, { withFileTypes: true });
for (const entry of entries) {
  if (entry.name === ".assetsignore") continue;
  await cp(join(srcDir, entry.name), join(destDir, entry.name), {
    recursive: true,
    force: true,
  });
}
console.log("Copied dist/client static assets into public/");