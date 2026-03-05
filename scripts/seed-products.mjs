// Plain Node.js seed script — no tsx/esbuild needed
// Usage: node scripts/seed-products.mjs

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL — ensure .env.local exists");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const BATCH_SIZE = 50;

async function seedFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const products = JSON.parse(raw);
  const fileName = path.basename(filePath);

  console.log(`\n📦 ${fileName}: ${products.length} products`);

  let totalInserted = 0;
  let totalSkipped = 0;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    try {
      const result = await client.mutation(
        api.seedProducts.insertBatch,
        { products: batch }
      );
      totalInserted += result.inserted;
      totalSkipped += result.skipped;
      process.stdout.write(
        `  Batch ${Math.floor(i / BATCH_SIZE) + 1}: +${result.inserted} inserted, ${result.skipped} skipped\n`
      );
    } catch (err) {
      console.error(
        `  ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`,
        err instanceof Error ? err.message : err
      );
    }
  }

  console.log(
    `  ✅ Done: ${totalInserted} inserted, ${totalSkipped} skipped`
  );
  return { inserted: totalInserted, skipped: totalSkipped };
}

async function main() {
  const dataDir = path.join(__dirname, "..", "data", "products");

  if (!fs.existsSync(dataDir)) {
    console.error(`Data directory not found: ${dataDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(dataDir)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => path.join(dataDir, f));

  console.log(`Found ${files.length} product files`);
  console.log(`Convex URL: ${CONVEX_URL.slice(0, 30)}...`);

  const grandTotal = { inserted: 0, skipped: 0 };

  for (const file of files) {
    const result = await seedFile(file);
    grandTotal.inserted += result.inserted;
    grandTotal.skipped += result.skipped;
  }

  console.log(`\n🎉 Grand total: ${grandTotal.inserted} inserted, ${grandTotal.skipped} skipped`);
}

main().catch(console.error);
