import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  parLevel: integer("par_level"),
  lastCountQuantity: integer("last_count_quantity"),
  lastCountDate: timestamp("last_count_date"),
});

export const inventorySessions = pgTable("inventory_sessions", {
  id: serial("id").primaryKey(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  userId: integer("user_id"),
  totalItems: integer("total_items").default(0),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).default("0"),
  syncedToMarginEdge: boolean("synced_to_margin_edge").default(false),
});

export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalValue: decimal("total_value", { precision: 10, scale: 2 }).notNull(),
  recordedAt: timestamp("recorded_at").notNull(),
  recognitionConfidence: decimal("recognition_confidence", { precision: 5, scale: 2 }),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertInventorySessionSchema = createInsertSchema(inventorySessions).omit({
  id: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InventorySession = typeof inventorySessions.$inferSelect;
export type InsertInventorySession = z.infer<typeof insertInventorySessionSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
