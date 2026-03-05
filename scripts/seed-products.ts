import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("Missing NEXT_PUBLIC_CONVEX_URL in environment");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const BATCH_SIZE = 50;

interface Product {
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  tags?: string[];
  primaryCategory?: string;
  type: "tool" | "saas";
  baselineScore: number;
}

async function seedFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const products: Product[] = JSON.parse(raw);
  const fileName = path.basename(filePath);

  console.log(`\n📦 ${fileName}: ${products.length} products`);

  let totalInserted = 0;
  let totalSkipped = 0;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);
    try {
      const result = await (client as any).mutation(
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
        err
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
    .map((f) => path.join(dataDir, f));

  console.log(`Found ${files.length} product files`);

  let grandTotal = { inserted: 0, skipped: 0 };

  for (const file of files) {
    const result = await seedFile(file);
    grandTotal.inserted += result.inserted;
    grandTotal.skipped += result.skipped;
  }

  console.log(`\n🎉 Grand total: ${grandTotal.inserted} inserted, ${grandTotal.skipped} skipped`);
}

main().catch(console.error);
