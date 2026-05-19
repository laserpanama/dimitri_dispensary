import 'dotenv/config';
import mysql from 'mysql2/promise';

const cannavidaProducts = [
  // FULL SPECTRUM GUMMIES  
  {
    name: "CBD Gummies Citrus - Full Spectrum",
    category: "edibles",
    description: "Full Spectrum CBD Gummies with natural citrus flavor. 30mg CBD per gummy, 900mg total per container.",
    price: "45.00",
    quantity: 100,
    cbdLevel: "30.00",
    thcLevel: null,
    strain: "Full Spectrum",
    effects: "Relaxation, wellness",
    image: "/product-images/cbd_fs_gummies_citrus.png"
  },
  {
    name: "CBD Gummies Blue Razberry - Full Spectrum",
    category: "edibles",
    description: "Full Spectrum CBD Gummies with blue razberry flavor. 30mg CBD per gummy, 900mg total per container.",
    price: "45.00",
    quantity: 100,
    cbdLevel: "30.00",
    thcLevel: null,
    strain: "Full Spectrum",
    effects: "Relaxation, wellness",
    image: "/product-images/cbd_fs_gummies_blue_razberry.png"
  },
  {
    name: "CBD Gummies Mixed Berry - Full Spectrum",
    category: "edibles",
    description: "Full Spectrum CBD Gummies with mixed berry flavor. 30mg CBD per gummy, 900mg total per container.",
    price: "45.00",
    quantity: 100,
    cbdLevel: "30.00",
    thcLevel: null,
    strain: "Full Spectrum",
    effects: "Relaxation, wellness",
    image: "/product-images/cbd_fs_gummies_mixed_berry.png"
  },
  {
    name: "CBD Gummies Strawberry - Full Spectrum",
    category: "edibles",
    description: "Full Spectrum CBD Gummies with strawberry flavor. 30mg CBD per gummy, 900mg total per container.",
    price: "45.00",
    quantity: 100,
    cbdLevel: "30.00",
    thcLevel: null,
    strain: "Full Spectrum",
    effects: "Relaxation, wellness",
    image: "/product-images/cbd_fs_gummies_strawberry.png"
  },

  // ISOLATE GUMMIES
  {
    name: "CBD Gummies Mixed Berry - Isolate",
    category: "edibles",
    description: "Pure CBD Isolate Gummies with mixed berry flavor. 30mg CBD per gummy, 900mg total. THC-free.",
    price: "40.00",
    quantity: 100,
    cbdLevel: "30.00",
    thcLevel: "0.00",
    strain: "Isolate",
    effects: "Relaxation, wellness",
    image: "/product-images/cbd_iso_gummies_mixed_berry.png"
  },

  // CBN SLEEP AID GUMMIES
  {
    name: "CBN Sleep Gummies Citrus",
    category: "edibles",
    description: "CBN Sleep Aid Gummies with natural citrus flavor. Promotes restful sleep. 30mg CBD per gummy.",
    price: "50.00",
    quantity: 75,
    cbdLevel: "5.00",
    thcLevel: "0.00",
    strain: "CBN Sleep Aid",
    effects: "Sleep aid, relaxation",
    image: "/product-images/cbn_sleep_gummies_citrus.png"
  },
  {
    name: "CBN Sleep Gummies Blue Razberry",
    category: "edibles",
    description: "CBN Sleep Aid Gummies with blue razberry flavor. Promotes restful sleep. 30mg CBD per gummy.",
    price: "50.00",
    quantity: 75,
    cbdLevel: "5.00",
    thcLevel: "0.00",
    strain: "CBN Sleep Aid",
    effects: "Sleep aid, relaxation",
    image: "/product-images/cbn_sleep_gummies_blue_razberry.png"
  },

  // SOFTGELS - FULL SPECTRUM
  {
    name: "CBD Softgels 30mg - Full Spectrum",
    category: "edibles",
    description: "Full Spectrum CBD Softgels. 30mg CBD per capsule, 900mg total per container. Easy to swallow.",
    price: "55.00",
    quantity: 80,
    cbdLevel: "30.00",
    thcLevel: null,
    strain: "Full Spectrum",
    effects: "Wellness, daily use",
    image: "/product-images/cbd_fs_softgels_30mg.png"
  },

  // SOFTGELS - ISOLATE
  {
    name: "CBD Softgels 30mg - Isolate",
    category: "edibles",
    description: "Pure CBD Isolate Softgels. 30mg CBD per capsule, 900mg total. THC-free. Easy to swallow.",
    price: "50.00",
    quantity: 80,
    cbdLevel: "30.00",
    thcLevel: "0.00",
    strain: "Isolate",
    effects: "Wellness, daily use",
    image: "/product-images/cbd_iso_softgels_30mg.png"
  },

  // TINCTURES - FULL SPECTRUM
  {
    name: "CBD Tincture 30mg - Full Spectrum",
    category: "tinctures",
    description: "Full Spectrum CBD Tincture. 30mg CBD per serving, 900mg total per bottle. Sublingual drops.",
    price: "60.00",
    quantity: 90,
    cbdLevel: "30.00",
    thcLevel: null,
    strain: "Full Spectrum",
    effects: "Fast-acting relief, wellness",
    image: "/product-images/cbd_fs_tincture_30mg.png"
  },
  {
    name: "CBD Tincture 60mg - Full Spectrum",
    category: "tinctures",
    description: "Full Spectrum CBD Tincture. 60mg CBD per serving, 1800mg total per bottle. Sublingual drops.",
    price: "95.00",
    quantity: 90,
    cbdLevel: "60.00",
    thcLevel: null,
    strain: "Full Spectrum",
    effects: "Fast-acting relief, wellness",
    image: "/product-images/cbd_fs_tincture_60mg.png"
  },

  // TINCTURES - ISOLATE
  {
    name: "CBD Tincture 30mg - Isolate",
    category: "tinctures",
    description: "Pure CBD Isolate Tincture. 30mg CBD per serving, 900mg total. THC-free. Sublingual drops.",
    price: "55.00",
    quantity: 90,
    cbdLevel: "30.00",
    thcLevel: "0.00",
    strain: "Isolate",
    effects: "Fast-acting relief, wellness",
    image: "/product-images/cbd_iso_tincture_30mg.png"
  },
  {
    name: "CBD Tincture 60mg - Isolate",
    category: "tinctures",
    description: "Pure CBD Isolate Tincture. 60mg CBD per serving, 1800mg total. THC-free. Sublingual drops.",
    price: "85.00",
    quantity: 90,
    cbdLevel: "60.00",
    thcLevel: "0.00",
    strain: "Isolate",
    effects: "Fast-acting relief, wellness",
    image: "/product-images/cbd_iso_tincture_60mg.png"
  },

  // SALVES - TOPICALS
  {
    name: "CBD Salve - Full Spectrum",
    category: "topicals",
    description: "Full Spectrum CBD Salve. 900mg CBD per bottle. Topical application for targeted relief.",
    price: "50.00",
    quantity: 70,
    cbdLevel: "15.00",
    thcLevel: null,
    strain: "Full Spectrum",
    effects: "Targeted relief, skin care",
    image: "/product-images/cbd_fs_salve.png"
  },
  {
    name: "CBD Salve - Isolate",
    category: "topicals",
    description: "Pure CBD Isolate Salve. 900mg CBD per bottle. THC-free. Topical application for targeted relief.",
    price: "45.00",
    quantity: 70,
    cbdLevel: "10.00",
    thcLevel: "0.00",
    strain: "Isolate",
    effects: "Targeted relief, skin care",
    image: "/product-images/cbd_iso_salve.png"
  },

  // MUSCLE GELS - TOPICALS
  {
    name: "CBD Muscle Gel - Full Spectrum",
    category: "topicals",
    description: "Full Spectrum CBD Muscle Gel. 1800mg CBD per bottle. Fast-absorbing topical gel for muscle relief.",
    price: "45.00",
    quantity: 60,
    cbdLevel: "15.00",
    thcLevel: null,
    strain: "Full Spectrum",
    effects: "Muscle relief, recovery",
    image: "/product-images/cbd_fs_muscle_gel.png"
  },
  {
    name: "CBD Muscle Gel - Isolate",
    category: "topicals",
    description: "Pure CBD Isolate Muscle Gel. 1800mg CBD per bottle. THC-free. Fast-absorbing gel for muscle relief.",
    price: "40.00",
    quantity: 60,
    cbdLevel: "10.00",
    thcLevel: "0.00",
    strain: "Isolate",
    effects: "Muscle relief, recovery",
    image: "/product-images/cbd_iso_muscle_gel.png"
  }
];

async function importProducts() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log(`Importing ${cannavidaProducts.length} CANNAVIDA products...`);
  
  try {
    // Delete existing products
    console.log('Clearing existing products...');
    await conn.execute('DELETE FROM products');
    
    // Insert all products
    for (const product of cannavidaProducts) {
      await conn.execute(
        `INSERT INTO products (name, description, category, price, quantity, thcLevel, cbdLevel, strain, effects, image, active) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.description,
          product.category,
          product.price,
          product.quantity,
          product.thcLevel,
          product.cbdLevel,
          product.strain,
          product.effects,
          product.image,
          true
        ]
      );
      console.log(`✓ Imported: ${product.name}`);
    }
    
    console.log(`\n✅ Successfully imported ${cannavidaProducts.length} products!`);
    
    // Show summary
    const summary = cannavidaProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\nProducts by category:');
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    
    await conn.end();
  } catch (error) {
    console.error('❌ Import failed:', error);
    await conn.end();
    process.exit(1);
  }
  
  process.exit(0);
}

importProducts();
