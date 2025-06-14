import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInventorySessionSchema, insertInventoryItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get product by SKU
  app.get("/api/products/sku/:sku", async (req, res) => {
    try {
      const { sku } = req.params;
      const product = await storage.getProductBySku(sku);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create inventory session
  app.post("/api/inventory-sessions", async (req, res) => {
    try {
      const sessionData = insertInventorySessionSchema.parse({
        ...req.body,
        startTime: new Date(req.body.startTime)
      });
      const session = await storage.createInventorySession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      console.error('Session creation error:', error);
      res.status(400).json({ message: "Invalid session data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get inventory session
  app.get("/api/inventory-sessions/:id", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const session = await storage.getInventorySession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });

  // Update inventory session
  app.patch("/api/inventory-sessions/:id", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updateInventorySession(sessionId, updates);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to update session" });
    }
  });

  // Add inventory item
  app.post("/api/inventory-items", async (req, res) => {
    try {
      const itemData = insertInventoryItemSchema.parse({
        ...req.body,
        recordedAt: new Date(req.body.recordedAt)
      });
      const item = await storage.addInventoryItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      console.error('Item creation error:', error);
      res.status(400).json({ message: "Invalid item data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get inventory items by session
  app.get("/api/inventory-sessions/:id/items", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const items = await storage.getInventoryItemsBySession(sessionId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory items" });
    }
  });

  // Voice recognition endpoint using Google Cloud Speech-to-Text
  app.post("/api/speech-to-text", async (req, res) => {
    try {
      const { audioData } = req.body;
      
      if (!audioData) {
        return res.status(400).json({ message: "Audio data is required" });
      }

      const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "Google Cloud API key not configured" });
      }

      // Call Google Cloud Speech-to-Text API
      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
            model: 'default',
            useEnhanced: true,
          },
          audio: {
            content: audioData,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Google Cloud Speech API error:', response.status, errorData);
        return res.status(500).json({ 
          message: "Speech recognition service error",
          error: `API returned ${response.status}`
        });
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return res.json({
          transcript: "",
          confidence: 0,
          quantity: 0,
          success: false,
          message: "No speech detected"
        });
      }

      const transcript = data.results[0].alternatives[0].transcript;
      const confidence = Math.round((data.results[0].alternatives[0].confidence || 0.8) * 100);
      
      // Extract quantity from transcript
      const quantity = extractQuantityFromText(transcript);

      res.json({
        transcript,
        confidence,
        quantity,
        success: true
      });

    } catch (error) {
      console.error('Speech recognition error:', error);
      res.status(500).json({ 
        message: "Speech recognition failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Simulate MarginEdge sync
  app.post("/api/sync-margin-edge", async (req, res) => {
    try {
      const { sessionId } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update session as synced
      const session = await storage.updateInventorySession(sessionId, {
        syncedToMarginEdge: true,
        endTime: new Date()
      });

      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json({
        success: true,
        message: "Successfully synced to MarginEdge",
        sessionId: sessionId,
        syncTime: new Date().toISOString()
      });

    } catch (error) {
      res.status(500).json({ 
        message: "Failed to sync with MarginEdge",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function extractQuantityFromText(text: string): number {
  const lowerText = text.toLowerCase();
  
  // Number word mappings
  const numberWords: { [key: string]: number } = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20
  };

  // Try to find numbers in text
  const numberMatch = lowerText.match(/\b(\d+)\b/);
  if (numberMatch) {
    return parseInt(numberMatch[1]);
  }

  // Try to find number words
  for (const [word, value] of Object.entries(numberWords)) {
    if (lowerText.includes(word)) {
      return value;
    }
  }

  return 0;
}
