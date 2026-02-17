import { getDb } from "./server/db";
import { products } from "./drizzle/schema";
import fs from "fs";
import path from "path";

interface ProductData {
  Handle: string;
  Titulo: string;
  Variante: string;
  Precio: string;
  SKU: string;
  "Codigo de Barras": string;
  Categoria: string;
  "Dosis por Porcion": string;
  "Dosis Total": string;
  Ingredientes: string;
  Descripcion: string;
}

// Map Spanish categories to English
const categoryMap: Record<string, "flower" | "edibles" | "concentrates" | "tinctures" | "topicals" | "accessories"> = {
  "Comprimidos Masticables": "edibles",
  Capsulas: "edibles",
  Tabletas: "edibles",
  Tinturas: "tinctures",
  "Geles Musculares": "topicals",
  Unguentos: "topicals",
};

async function importProducts() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    return;
  }

  // Read CSV file
  const csvPath = "/home/ubuntu/upload/pasted_content.txt";
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    return;
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n");
  const headers = lines[0].split(",");

  // Parse CSV data
  const productList: ProductData[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = lines[i].split(",");
    const product: Partial<ProductData> = {};

    headers.forEach((header, index) => {
      product[header as keyof ProductData] = values[index]?.trim() || "";
    });

    productList.push(product as ProductData);
  }

  console.log(`Found ${productList.length} products to import`);

  // Insert products into database
  for (const product of productList) {
    try {
      const category = categoryMap[product.Categoria] || "edibles";
      const price = product.Precio ? parseFloat(product.Precio) : 29.99;
      const thcLevel = product.Titulo.toLowerCase().includes("thc") ? 0 : null;
      const cbdLevel = product["Dosis por Porcion"]
        ? parseFloat(product["Dosis por Porcion"].split("+")[0].trim())
        : null;

      // Generate a random image URL for the product
      const imageUrl = `https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop&t=${Date.now()}`;

      await db.insert(products).values({
        name: product.Titulo,
        description: product.Descripcion,
        category,
        price,
        quantity: 100, // Default quantity
        thcLevel: thcLevel !== null ? thcLevel : undefined,
        cbdLevel: cbdLevel || undefined,
        strain: product.Variante,
        effects: product.Ingredientes,
        image: imageUrl,
        active: true,
      });

      console.log(`✓ Imported: ${product.Titulo} - ${product.Variante}`);
    } catch (error) {
      console.error(`Failed to import ${product.Titulo}:`, error);
    }
  }

  console.log("Product import complete!");
}

importProducts().catch(console.error);
