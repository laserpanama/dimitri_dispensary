import { getDb } from "./server/db";
import { products } from "./drizzle/schema";
import { eq } from "drizzle-orm";

// Product image URLs - using publicly available cannabis product images
const productImageUrls: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  2: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  3: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  4: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  5: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  6: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  7: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  8: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  9: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  10: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  11: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
  12: "https://images.unsplash.com/photo-1599599810694-b5ac4dd37e58?w=500&h=500&fit=crop",
};

async function updateProductImages() {
  const db = await getDb();
  if (!db) {
    console.error("Database connection failed");
    return;
  }

  console.log("Starting product image update...");

  for (const [productId, imageUrl] of Object.entries(productImageUrls)) {
    try {
      const id = parseInt(productId, 10);
      await db
        .update(products)
        .set({ image: imageUrl })
        .where(eq(products.id, id));

      console.log(`✓ Updated product ${id} with image`);
    } catch (error) {
      console.error(`Failed to update product ${productId}:`, error);
    }
  }

  console.log("Product image update complete!");
}

updateProductImages().catch(console.error);
