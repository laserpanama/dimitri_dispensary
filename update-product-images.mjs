import { storagePut } from './server/storage.js';
import { getDb } from './server/db.js';
import { products } from './drizzle/schema.js';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const productImages = {
  1: '/home/ubuntu/upload/search_images/My4m6edBlHjo.jpg', // Flower
  2: '/home/ubuntu/upload/search_images/ZZIxa8AciqmS.jpg',  // Flower
  3: '/home/ubuntu/upload/search_images/v94LILZTGHJq.jpg',  // Flower
  4: '/home/ubuntu/upload/search_images/l1CIwqUXFJrl.jpg',  // Edibles
  5: '/home/ubuntu/upload/search_images/jnz7dgTWWLkt.jpg',  // Edibles
  6: '/home/ubuntu/upload/search_images/0AFjJhG6YXBK.png',  // Edibles
  7: '/home/ubuntu/upload/search_images/Xl5ZEATc7xg7.jpg',  // Concentrates
  8: '/home/ubuntu/upload/search_images/GdoXqjDN1amA.jpg',  // Concentrates
};

async function uploadProductImages() {
  console.log('Starting product image upload...');
  
  for (const [productId, imagePath] of Object.entries(productImages)) {
    try {
      if (!fs.existsSync(imagePath)) {
        console.log(`Image not found: ${imagePath}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(imagePath);
      const fileName = path.basename(imagePath);
      const fileKey = `products/${productId}-${Date.now()}-${fileName}`;
      
      console.log(`Uploading image for product ${productId}...`);
      const { url } = await storagePut(fileKey, fileBuffer);
      
      console.log(`✓ Uploaded: ${url}`);
    } catch (error) {
      console.error(`Failed to upload image for product ${productId}:`, error.message);
    }
  }
  
  console.log('Image upload complete!');
}

uploadProductImages().catch(console.error);
