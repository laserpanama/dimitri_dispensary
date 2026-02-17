import { getDb } from "./server/db";
import { products } from "./drizzle/schema";

const cannavidaProducts = [
  { name: "CBD Full Spectrum Gummies - Citrus", description: "Delicious citrus-flavored gummies with 30mg CBD per serving. Full spectrum formula.", category: "edibles", price: 34.99, cbdLevel: 30, strain: "Full Spectrum", effects: "Relaxing, anti-inflammatory" },
  { name: "CBD Full Spectrum Gummies - Blue Razberry", description: "Blue Razberry flavored full spectrum CBD gummies. 30mg CBD per gummy.", category: "edibles", price: 34.99, cbdLevel: 30, strain: "Full Spectrum", effects: "Relaxing, anti-inflammatory" },
  { name: "CBD Full Spectrum Gummies - Mixed Berry", description: "Mixed berry flavored gummies. 30mg full spectrum CBD per serving.", category: "edibles", price: 34.99, cbdLevel: 30, strain: "Full Spectrum", effects: "Relaxing, anti-inflammatory" },
  { name: "CBD Full Spectrum Gummies - Strawberry", description: "Fresh strawberry flavored gummies with full spectrum CBD.", category: "edibles", price: 34.99, cbdLevel: 30, strain: "Full Spectrum", effects: "Relaxing, anti-inflammatory" },
  { name: "CBD Isolate Gummies - Mixed Berry", description: "Pure CBD isolate gummies with no THC. 30mg per gummy.", category: "edibles", price: 32.99, cbdLevel: 30, strain: "Isolate", effects: "Relaxing, anti-inflammatory" },
  { name: "CBD Isolate Gummies - Citrus", description: "Pure CBD isolate in citrus flavor. Zero THC formulation.", category: "edibles", price: 32.99, cbdLevel: 30, strain: "Isolate", effects: "Relaxing, anti-inflammatory" },
  { name: "CBD Full Spectrum Softgels - 10mg", description: "Premium softgel capsules with 10mg full spectrum CBD.", category: "edibles", price: 24.99, cbdLevel: 10, strain: "Full Spectrum", effects: "Relaxing, anti-inflammatory" },
  { name: "CBD Full Spectrum Softgels - 30mg", description: "High-potency softgel capsules with 30mg full spectrum CBD.", category: "edibles", price: 39.99, cbdLevel: 30, strain: "Full Spectrum", effects: "Relaxing, anti-inflammatory" },
  { name: "CBD Isolate Softgels - 30mg", description: "Pure CBD isolate softgels with no THC. 30mg per capsule.", category: "edibles", price: 37.99, cbdLevel: 30, strain: "Isolate", effects: "Relaxing, anti-inflammatory" },
  { name: "CBD Sleep Tablets - Original", description: "Specially formulated tablets designed to promote restful sleep.", category: "edibles", price: 29.99, cbdLevel: 25, strain: "Full Spectrum", effects: "Sleep support, relaxation" },
  { name: "CBD Full Spectrum Tincture - 30mg/ml", description: "Fast-acting liquid extract with 30mg CBD per ml. Full spectrum formula.", category: "tinctures", price: 44.99, cbdLevel: 30, strain: "Full Spectrum", effects: "Fast-acting, relaxing" },
  { name: "CBD Full Spectrum Tincture - 60mg/ml", description: "High-potency tincture with 60mg CBD per ml.", category: "tinctures", price: 69.99, cbdLevel: 60, strain: "Full Spectrum", effects: "Fast-acting, relaxing" },
  { name: "CBD Isolate Tincture - 30mg/ml", description: "Pure CBD isolate tincture with no THC. 30mg per ml.", category: "tinctures", price: 42.99, cbdLevel: 30, strain: "Isolate", effects: "Fast-acting, anxiety relief" },
  { name: "CBD Isolate Tincture - 60mg/ml", description: "High-potency pure CBD isolate tincture. 60mg per ml.", category: "tinctures", price: 64.99, cbdLevel: 60, strain: "Isolate", effects: "Fast-acting, anxiety relief" },
  { name: "CBD Full Spectrum Muscle Gel - Roll-On", description: "Convenient roll-on muscle gel with full spectrum CBD.", category: "topicals", price: 24.99, cbdLevel: 50, strain: "Full Spectrum", effects: "Muscle relaxation, pain relief" },
  { name: "CBD Isolate Muscle Gel - Roll-On", description: "Pure CBD isolate muscle gel in convenient roll-on format.", category: "topicals", price: 22.99, cbdLevel: 50, strain: "Isolate", effects: "Muscle relaxation, pain relief" },
  { name: "CBD Full Spectrum Salve - Original", description: "Premium salve with full spectrum CBD for skin and muscle care.", category: "topicals", price: 28.99, cbdLevel: 100, strain: "Full Spectrum", effects: "Skin health, muscle relief" },
  { name: "CBD Isolate Salve - Original", description: "Pure CBD isolate salve with no THC.", category: "topicals", price: 26.99, cbdLevel: 100, strain: "Isolate", effects: "Skin health, muscle relief" }
];

async function importProducts() {
  const db = await getDb();
  if (!db) { console.error("DB failed"); return; }
  
  console.log(`Importing ${cannavidaProducts.length} products...`);
  for (const p of cannavidaProducts) {
    try {
      await db.insert(products).values({
        name: p.name,
        description: p.description,
        category: p.category,
        price: p.price,
        quantity: 100,
        cbdLevel: p.cbdLevel,
        strain: p.strain,
        effects: p.effects,
        image: "https://images.unsplash.com/photo-1599599810694-5ac4dd37e58?w=500&h=500&fit=crop",
        active: true,
      });
      console.log(`✓ ${p.name}`);
    } catch (e) { console.error(`✗ ${p.name}`); }
  }
  console.log("Done!");
}

importProducts().catch(console.error);
