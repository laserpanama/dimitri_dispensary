import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./drizzle/schema.js";

const db = new Database("./dev.db");
const drizzleDb = drizzle(db, { schema });

// Create tables manually
db.exec(`
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  quantity INTEGER DEFAULT 0,
  thcLevel REAL,
  cbdLevel REAL,
  strain TEXT,
  effects TEXT,
  image TEXT,
  active INTEGER DEFAULT 1,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO products (id, name, description, category, price, quantity, strain, thcLevel, cbdLevel, active) VALUES 
(1, 'OG Kush', 'Classic indica strain with earthy flavor', 'flower', 45.00, 20, 'OG Kush', 23.5, 0.1, 1),
(2, 'Blue Dream', 'Balanced hybrid, sweet berry aroma', 'flower', 42.00, 15, 'Blue Dream', 21.0, 0.2, 1),
(3, 'Gummies', 'THC-infused fruit gummies', 'edibles', 25.00, 50, NULL, NULL, NULL, 1);
`);

console.log("Database seeded!");
