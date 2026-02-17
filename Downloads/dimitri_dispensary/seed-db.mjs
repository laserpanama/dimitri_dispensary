import { drizzle } from "drizzle-orm/mysql2";
import { products, blogPosts } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const sampleProducts = [
  // Flower
  {
    name: "Blue Dream",
    description: "Uplifting and creative sativa-dominant hybrid",
    category: "flower",
    price: "12.99",
    quantity: 50,
    thcLevel: "18.5",
    cbdLevel: "0.5",
    strain: "Blue Dream",
    effects: JSON.stringify(["creative", "energetic", "uplifting"]),
  },
  {
    name: "Granddaddy Purple",
    description: "Relaxing indica with grape and berry flavors",
    category: "flower",
    price: "14.99",
    quantity: 45,
    thcLevel: "20.0",
    cbdLevel: "0.3",
    strain: "Granddaddy Purple",
    effects: JSON.stringify(["relaxing", "sleepy", "euphoric"]),
  },
  {
    name: "Green Crack",
    description: "Energizing sativa with citrus notes",
    category: "flower",
    price: "13.99",
    quantity: 40,
    thcLevel: "17.0",
    cbdLevel: "0.2",
    strain: "Green Crack",
    effects: JSON.stringify(["energetic", "focused", "happy"]),
  },
  // Edibles
  {
    name: "Gummy Bears - 10mg",
    description: "Assorted fruit flavored gummies, 10mg THC each",
    category: "edibles",
    price: "8.99",
    quantity: 100,
    thcLevel: "10.0",
    cbdLevel: "0.0",
    strain: null,
    effects: JSON.stringify(["relaxing", "euphoric"]),
  },
  {
    name: "Chocolate Bar - 100mg",
    description: "Dark chocolate with 100mg THC",
    category: "edibles",
    price: "16.99",
    quantity: 60,
    thcLevel: "100.0",
    cbdLevel: "0.0",
    strain: null,
    effects: JSON.stringify(["relaxing", "creative"]),
  },
  // Concentrates
  {
    name: "Shatter - Blue Dream",
    description: "High-potency shatter concentrate",
    category: "concentrates",
    price: "35.99",
    quantity: 25,
    thcLevel: "85.0",
    cbdLevel: "1.0",
    strain: "Blue Dream",
    effects: JSON.stringify(["creative", "uplifting"]),
  },
  {
    name: "Wax - Granddaddy Purple",
    description: "Smooth wax concentrate with rich flavor",
    category: "concentrates",
    price: "32.99",
    quantity: 20,
    thcLevel: "80.0",
    cbdLevel: "0.5",
    strain: "Granddaddy Purple",
    effects: JSON.stringify(["relaxing", "euphoric"]),
  },
  // Tinctures
  {
    name: "CBD Tincture - 1000mg",
    description: "Pure CBD tincture for wellness",
    category: "tinctures",
    price: "24.99",
    quantity: 30,
    thcLevel: "0.0",
    cbdLevel: "99.0",
    strain: null,
    effects: JSON.stringify(["relaxing", "pain relief"]),
  },
  {
    name: "THC/CBD Tincture - 1:1",
    description: "Balanced THC and CBD blend",
    category: "tinctures",
    price: "28.99",
    quantity: 25,
    thcLevel: "50.0",
    cbdLevel: "50.0",
    strain: null,
    effects: JSON.stringify(["balanced", "therapeutic"]),
  },
  // Topicals
  {
    name: "Muscle Relief Cream",
    description: "CBD-infused cream for muscle soreness",
    category: "topicals",
    price: "19.99",
    quantity: 40,
    thcLevel: "0.0",
    cbdLevel: "99.0",
    strain: null,
    effects: JSON.stringify(["pain relief", "anti-inflammatory"]),
  },
  // Accessories
  {
    name: "Glass Bong",
    description: "Premium borosilicate glass bong",
    category: "accessories",
    price: "49.99",
    quantity: 15,
    thcLevel: null,
    cbdLevel: null,
    strain: null,
    effects: null,
  },
  {
    name: "Rolling Papers - King Size",
    description: "Organic rolling papers, 50 leaves",
    category: "accessories",
    price: "3.99",
    quantity: 200,
    thcLevel: null,
    cbdLevel: null,
    strain: null,
    effects: null,
  },
];

const sampleBlogPosts = [
  {
    title: "Understanding THC vs CBD: What's the Difference?",
    slug: "thc-vs-cbd-difference",
    content: `# Understanding THC vs CBD

Cannabis contains over 100 different cannabinoids, but the two most well-known are THC and CBD. While they come from the same plant, they have very different effects on the body and mind.

## THC (Tetrahydrocannabinol)

THC is the primary psychoactive compound in cannabis. It's responsible for the "high" that users experience. THC binds to CB1 receptors in the brain, affecting perception, memory, and mood.

**Effects:**
- Euphoria and relaxation
- Altered perception of time
- Increased appetite
- Pain relief
- Potential anxiety (in some users)

## CBD (Cannabidiol)

CBD is a non-psychoactive cannabinoid that doesn't produce a "high." Instead, it interacts with the body's endocannabinoid system in different ways than THC.

**Effects:**
- Relaxation without intoxication
- Potential pain relief
- Anti-inflammatory properties
- Anxiety reduction
- Sleep improvement

## Choosing What's Right for You

The choice between THC and CBD depends on your personal needs and preferences. Some people prefer CBD for daytime use, while others enjoy THC for evening relaxation. Many users find that a combination of both works best for their needs.

Always start with low doses and consult with our specialists to find what works best for you.`,
    excerpt: "Learn the key differences between THC and CBD and how they affect your body.",
    category: "education",
    author: "Dimitri's Team",
    published: true,
    publishedAt: new Date(),
    generatedByAI: false,
  },
  {
    title: "Blue Dream Strain Review",
    slug: "blue-dream-strain-review",
    content: `# Blue Dream Strain Review

Blue Dream is one of the most popular cannabis strains in the world. This sativa-dominant hybrid offers a unique balance of effects that makes it perfect for both daytime and evening use.

## Appearance and Aroma

Blue Dream buds are typically large and fluffy with a light green color and blue-purple hues. The aroma is sweet and fruity with hints of berry and vanilla.

## Effects

Users report a smooth, uplifting high that starts with a cerebral rush followed by a relaxing body sensation. Many find it perfect for creative activities or social situations.

**Common Effects:**
- Creative and focused thinking
- Uplifting mood
- Relaxed body sensation
- Increased sociability

## Medical Uses

Many patients use Blue Dream for:
- Chronic pain relief
- Anxiety and depression
- Fatigue
- Lack of appetite

## Flavor Profile

Expect sweet berry flavors with hints of vanilla and a smooth smoke.

## Overall Rating

Blue Dream is an excellent choice for both beginners and experienced users. Its balanced effects and pleasant flavor make it a dispensary staple.

**Rating: 9/10**`,
    excerpt: "A comprehensive review of the popular Blue Dream strain.",
    category: "strain_review",
    author: "Dimitri's Team",
    published: true,
    publishedAt: new Date(),
    generatedByAI: false,
  },
  {
    title: "Cannabis and Wellness: A Beginner's Guide",
    slug: "cannabis-wellness-guide",
    content: `# Cannabis and Wellness: A Beginner's Guide

Cannabis has been used for wellness purposes for thousands of years. Modern research is increasingly supporting many traditional uses while also discovering new therapeutic applications.

## Common Wellness Uses

### Sleep Support
Many people use cannabis to improve sleep quality. CBD and certain THC strains can help users fall asleep faster and stay asleep longer.

### Pain Management
Cannabis is increasingly recognized for its pain-relieving properties. Both THC and CBD show promise for chronic pain conditions.

### Stress and Anxiety
CBD in particular has shown potential for reducing anxiety and promoting relaxation without the psychoactive effects of THC.

### Inflammation
Cannabis contains compounds with anti-inflammatory properties that may help with various inflammatory conditions.

## Getting Started

1. **Consult with a specialist** - Our doctors can help you understand which products might work best for your needs
2. **Start low and go slow** - Begin with small doses and gradually increase as needed
3. **Choose the right product** - Different forms (flower, edibles, tinctures) work differently for different people
4. **Keep a journal** - Track how different products affect you to find what works best

## Important Considerations

- Cannabis affects everyone differently
- Quality matters - choose products from reputable sources
- Consistency is key - regular use may be more effective than occasional use
- Consult healthcare providers about interactions with medications

Remember, cannabis is a tool for wellness, not a cure-all. It works best as part of a comprehensive health routine.`,
    excerpt: "Explore how cannabis can support your wellness journey.",
    category: "wellness",
    author: "Dimitri's Team",
    published: true,
    publishedAt: new Date(),
    generatedByAI: false,
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Insert products
    console.log("📦 Adding products...");
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
    }
    console.log(`✓ Added ${sampleProducts.length} products`);

    // Insert blog posts
    console.log("📝 Adding blog posts...");
    for (const post of sampleBlogPosts) {
      await db.insert(blogPosts).values(post);
    }
    console.log(`✓ Added ${sampleBlogPosts.length} blog posts`);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
