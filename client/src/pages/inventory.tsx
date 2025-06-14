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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-6 shadow-xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-xl p-3">
                <Package2 className="text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Voice Inventory Pro</h1>
                <p className="text-blue-100">AI-Powered Beverage Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                <BadgeCheck className="text-green-300" />
                <span className="text-sm">Live Demo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Session Status */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Live Session</h2>
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {sessionStats.startTime}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-3xl font-bold text-blue-600">{sessionStats.itemCount}</p>
                    <p className="text-xs text-gray-600">Items</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-3xl font-bold text-green-600">${sessionStats.totalValue}</p>
                    <p className="text-xs text-gray-600">Value</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-3xl font-bold text-orange-600">{sessionStats.avgAccuracy}%</p>
                    <p className="text-xs text-gray-600">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Scanner */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FileScan className="mr-3 text-blue-600" />
                  Product Scanner
                </h3>
                <ProductLookup onProductFound={handleProductFound} />
              </CardContent>
            </Card>

          </div>

          {/* Center Column - Product & Voice */}
          <div className="lg:col-span-1 space-y-6">

            {/* Product Display */}
            {selectedProduct && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🍷</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">{selectedProduct.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">SKU: {selectedProduct.sku}</p>
                      <p className="text-lg font-bold text-green-600">${selectedProduct.unitPrice}/unit</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Last Count:</span>
                      <span>
                        {selectedProduct.lastCountQuantity} units 
                        {selectedProduct.lastCountDate && 
                          ` (${Math.ceil((Date.now() - new Date(selectedProduct.lastCountDate).getTime()) / (1000 * 60 * 60 * 24))} days ago)`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Par Level:</span>
                      <span className="font-bold">{selectedProduct.parLevel} units</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Voice Recording */}
            {selectedProduct && (
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <Mic className="mr-3 text-orange-600" />
                    Voice Quantity Input
                  </h3>
                  <VoiceRecorder onQuantityConfirmed={handleQuantityConfirmed} />
                </CardContent>
              </Card>
            )}

          </div>

          {/* Right Column - Session Data */}
          <div className="lg:col-span-1 space-y-6">

            {/* Inventory List */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-between">
                  <span className="flex items-center">
                    <List className="mr-3 text-purple-600" />
                    Session Items
                  </span>
                  <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{sessionItems.length} items</span>
                </h3>
                
                <InventorySession items={sessionItems} />
              </CardContent>
            </Card>

            {/* MarginEdge Integration */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <FolderSync className="mr-3 text-green-600" />
                  MarginEdge Integration
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <Info className="text-blue-600" />
                      <span className="text-sm font-bold text-blue-800">Ready to Sync</span>
                    </div>
                    <p className="text-sm text-blue-700 ml-8">
                      {sessionItems.length} items ready for transmission to MarginEdge platform
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="secondary"
                      className="text-sm font-medium py-3"
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Session
                    </Button>
                    <Button 
                      className="text-sm font-medium py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      onClick={() => session?.id && syncToMarginEdge(session.id)}
                      disabled={isLoading || sessionItems.length === 0}
                    >
                      <CloudUpload className="w-4 h-4 mr-2" />
                      {isLoading ? "Syncing..." : "Sync to MarginEdge"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </main>
    </div>
  );
}
