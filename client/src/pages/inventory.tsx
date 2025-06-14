import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Package2, Mic, FileScan, List, FolderSync, Info, Save, CloudUpload } from "lucide-react";
import ProductLookup from "@/components/ProductLookup";
import VoiceRecorder from "@/components/VoiceRecorder";
import InventorySession from "@/components/InventorySession";
import { useInventorySession } from "@/hooks/useInventorySession";
import { Product } from "@shared/schema";

export default function InventoryPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { 
    session, 
    sessionItems, 
    addItem, 
    syncToMarginEdge, 
    isLoading,
    sessionStats 
  } = useInventorySession();

  const handleProductFound = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuantityConfirmed = (quantity: number, confidence: number) => {
    if (selectedProduct) {
      addItem(selectedProduct, quantity, confidence);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="bg-surface min-h-screen">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-4 shadow-lg">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center space-x-3">
            <Package2 className="text-2xl" />
            <div>
              <h1 className="text-lg font-medium">Voice Inventory</h1>
              <p className="text-sm opacity-90">MarginEdge Integration</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BadgeCheck className="text-green-300" />
            <span className="text-xs opacity-75">Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Session Status */}
        <Card className="card-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-medium text-on-surface">Current Session</h2>
              <span className="text-sm text-gray-600">
                Started {sessionStats.startTime}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{sessionStats.itemCount}</p>
                <p className="text-xs text-gray-600">Items Counted</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">${sessionStats.totalValue}</p>
                <p className="text-xs text-gray-600">Total Value</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">{sessionStats.avgAccuracy}%</p>
                <p className="text-xs text-gray-600">Voice Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Scanner */}
        <Card className="card-shadow">
          <CardContent className="p-4">
            <h3 className="text-md font-medium text-on-surface mb-4 flex items-center">
              <FileScan className="mr-2" />
              Product Identification
            </h3>
            <ProductLookup onProductFound={handleProductFound} />
          </CardContent>
        </Card>

        {/* Product Display */}
        {selectedProduct && (
          <Card className="card-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="material-icons text-gray-400">🍷</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-on-surface">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
                  <p className="text-sm text-secondary font-medium">${selectedProduct.unitPrice}/unit</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Last Count:</span>
                  <span>
                    {selectedProduct.lastCountQuantity} units 
                    {selectedProduct.lastCountDate && 
                      ` (${Math.ceil((Date.now() - new Date(selectedProduct.lastCountDate).getTime()) / (1000 * 60 * 60 * 24))} days ago)`
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Par Level:</span>
                  <span>{selectedProduct.parLevel} units</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Voice Recording */}
        {selectedProduct && (
          <Card className="card-shadow">
            <CardContent className="p-6">
              <h3 className="text-md font-medium text-on-surface mb-4 flex items-center">
                <Mic className="mr-2" />
                Voice Quantity Input
              </h3>
              <VoiceRecorder onQuantityConfirmed={handleQuantityConfirmed} />
            </CardContent>
          </Card>
        )}

        {/* Inventory List */}
        <Card className="card-shadow">
          <CardContent className="p-4">
            <h3 className="text-md font-medium text-on-surface mb-4 flex items-center justify-between">
              <span className="flex items-center">
                <List className="mr-2" />
                Session Items
              </span>
              <span className="text-sm text-gray-500">{sessionItems.length} items</span>
            </h3>
            
            <InventorySession items={sessionItems} />
          </CardContent>
        </Card>

        {/* MarginEdge FolderSync */}
        <Card className="card-shadow">
          <CardContent className="p-4">
            <h3 className="text-md font-medium text-on-surface mb-4 flex items-center">
              <FolderSync className="mr-2" />
              MarginEdge Integration
            </h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-3 mb-2">
                  <Info className="text-primary" />
                  <span className="text-sm font-medium">Ready to FolderSync</span>
                </div>
                <p className="text-xs text-gray-600 ml-8">
                  {sessionItems.length} items ready for transmission to MarginEdge
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="secondary"
                  className="text-sm ripple"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save Session
                </Button>
                <Button 
                  className="text-sm ripple"
                  onClick={() => session && syncToMarginEdge(session.id)}
                  disabled={isLoading || sessionItems.length === 0}
                >
                  <CloudUpload className="w-4 h-4 mr-1" />
                  {isLoading ? "Syncing..." : "FolderSync to MarginEdge"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
