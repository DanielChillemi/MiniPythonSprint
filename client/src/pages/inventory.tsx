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
    <div className="notepad-page min-h-screen p-8">
      {/* Header */}
      <header className="notepad-header text-white px-6 py-6 mb-8 rounded-t-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-xl p-3">
                <Package2 className="text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold handwritten-text text-white">Voice Inventory Pro</h1>
                <p className="text-blue-100 handwritten-text">AI-Powered Beverage Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                <BadgeCheck className="text-green-300" />
                <span className="text-sm handwritten-text">Live Demo</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[2000px] mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 gap-6 2xl:gap-8 min-h-[calc(100vh-200px)]">
        
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Session Status */}
            <Card className="notepad-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold handwritten-text text-blue-800">Live Session</h2>
                  <span className="text-sm handwritten-text text-gray-700 bg-yellow-200 px-2 py-1 rounded">
                    {sessionStats.startTime}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center mt-6">
                  <div className="bg-yellow-100 rounded-lg p-3 border-2 border-dashed border-blue-300">
                    <p className="text-3xl font-bold handwritten-text text-blue-700">{sessionStats.itemCount}</p>
                    <p className="text-xs handwritten-text text-gray-600">Items</p>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-3 border-2 border-dashed border-green-300">
                    <p className="text-3xl font-bold handwritten-text text-green-700">${sessionStats.totalValue}</p>
                    <p className="text-xs handwritten-text text-gray-600">Value</p>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-3 border-2 border-dashed border-orange-300">
                    <p className="text-3xl font-bold handwritten-text text-orange-700">{sessionStats.avgAccuracy}%</p>
                    <p className="text-xs handwritten-text text-gray-600">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Scanner & Voice Input */}
            <Card className="notepad-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold handwritten-text text-blue-800 mb-4 flex items-center">
                  <FileScan className="mr-3 text-blue-600" />
                  Product Scanner
                </h3>
                <ProductLookup onProductFound={handleProductFound} />
                
                {/* Voice Recording Section */}
                {selectedProduct && (
                  <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-400">
                    <h4 className="text-md font-bold handwritten-text text-blue-800 mb-4 flex items-center">
                      <Mic className="mr-3 text-orange-600" />
                      Voice Quantity Input
                    </h4>
                    <VoiceRecorder onQuantityConfirmed={handleQuantityConfirmed} />
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Center Column - Product Details */}
          <div className="xl:col-span-1 lg:col-span-1 space-y-6">

            {/* Product Display */}
            {selectedProduct && (
              <Card className="notepad-card">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-yellow-200 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🍷</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold handwritten-text text-blue-800">{selectedProduct.name}</h3>
                      <p className="text-sm handwritten-text text-gray-700 mb-1">SKU: {selectedProduct.sku}</p>
                      <p className="text-lg font-bold handwritten-text text-green-700">${selectedProduct.unitPrice}/unit</p>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-100 border border-dashed border-gray-400 rounded-lg p-4 mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium handwritten-text text-gray-700">Last Count:</span>
                      <span className="handwritten-text text-gray-700">
                        {selectedProduct.lastCountQuantity} units 
                        {selectedProduct.lastCountDate && 
                          ` (${Math.ceil((Date.now() - new Date(selectedProduct.lastCountDate).getTime()) / (1000 * 60 * 60 * 24))} days ago)`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium handwritten-text text-gray-700">Par Level:</span>
                      <span className="font-bold handwritten-text text-gray-800">{selectedProduct.parLevel} units</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>

          {/* Right Column - Session Data */}
          <div className="xl:col-span-2 lg:col-span-1 space-y-6">

            {/* Inventory List */}
            <Card className="notepad-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold handwritten-text text-blue-800 mb-4 flex items-center justify-between">
                  <span className="flex items-center">
                    <List className="mr-3 text-purple-600" />
                    Session Items
                  </span>
                  <span className="text-sm bg-purple-200 text-purple-800 px-2 py-1 rounded-full handwritten-text">{sessionItems.length} items</span>
                </h3>
                
                <InventorySession items={sessionItems} />
              </CardContent>
            </Card>

            {/* MarginEdge Integration */}
            <Card className="notepad-card">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold handwritten-text text-blue-800 mb-4 flex items-center">
                  <FolderSync className="mr-3 text-green-600" />
                  MarginEdge Integration
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-yellow-100 border-2 border-dashed border-blue-400 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <Info className="text-blue-600" />
                      <span className="text-sm font-bold handwritten-text text-blue-800">Ready to Sync</span>
                    </div>
                    <p className="text-sm handwritten-text text-blue-700 ml-8">
                      {sessionItems.length} items ready for transmission to MarginEdge platform
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      variant="secondary"
                      className="text-sm font-medium py-3 handwritten-text bg-yellow-200 border-2 border-dashed border-gray-400 hover:bg-yellow-300"
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Session
                    </Button>
                    <Button 
                      className="text-sm font-medium py-3 handwritten-text bg-green-200 border-2 border-dashed border-green-400 hover:bg-green-300 text-green-800"
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
