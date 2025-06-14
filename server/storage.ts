import { 
  users, 
  products, 
  inventorySessions, 
  inventoryItems,
  type User, 
  type InsertUser,
  type Product,
  type InsertProduct,
  type InventorySession,
  type InsertInventorySession,
  type InventoryItem,
  type InsertInventoryItem
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  createInventorySession(session: InsertInventorySession): Promise<InventorySession>;
  getInventorySession(id: number): Promise<InventorySession | undefined>;
  updateInventorySession(id: number, updates: Partial<InventorySession>): Promise<InventorySession | undefined>;
  
  addInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  getInventoryItemsBySession(sessionId: number): Promise<InventoryItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private inventorySessions: Map<number, InventorySession>;
  private inventoryItems: Map<number, InventoryItem>;
  private currentUserId: number;
  private currentProductId: number;
  private currentSessionId: number;
  private currentItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.inventorySessions = new Map();
    this.inventoryItems = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentSessionId = 1;
    this.currentItemId = 1;
    
    // Initialize with mock products
    this.initializeMockProducts();
  }

  private initializeMockProducts() {
    const mockProducts: Omit<Product, 'id'>[] = [
      {
        sku: "VDK-GG-750",
        name: "Grey Goose Vodka 750ml",
        unitPrice: "34.99",
        category: "Spirits",
        parLevel: 12,
        lastCountQuantity: 8,
        lastCountDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        sku: "BEER-COR-24",
        name: "Corona Extra 12oz (24-pack)",
        unitPrice: "28.24",
        category: "Beer",
        parLevel: 8,
        lastCountQuantity: 6,
        lastCountDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        sku: "WINE-CAB-750",
        name: "Cabernet Sauvignon 750ml",
        unitPrice: "20.00",
        category: "Wine",
        parLevel: 24,
        lastCountQuantity: 18,
        lastCountDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    mockProducts.forEach(product => {
      const id = this.currentProductId++;
      this.products.set(id, { ...product, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.sku === sku,
    );
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async createInventorySession(insertSession: InsertInventorySession): Promise<InventorySession> {
    const id = this.currentSessionId++;
    const session: InventorySession = { ...insertSession, id };
    this.inventorySessions.set(id, session);
    return session;
  }

  async getInventorySession(id: number): Promise<InventorySession | undefined> {
    return this.inventorySessions.get(id);
  }

  async updateInventorySession(id: number, updates: Partial<InventorySession>): Promise<InventorySession | undefined> {
    const session = this.inventorySessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.inventorySessions.set(id, updatedSession);
    return updatedSession;
  }

  async addInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = this.currentItemId++;
    const item: InventoryItem = { ...insertItem, id };
    this.inventoryItems.set(id, item);
    return item;
  }

  async getInventoryItemsBySession(sessionId: number): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values()).filter(
      (item) => item.sessionId === sessionId,
    );
  }
}

export const storage = new MemStorage();
