import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { List, FolderSync, Info, CloudUpload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// L.O.G. Framework - Granular Components
import InventoryHeader from "@/components/inventory/InventoryHeader";
import ProductSelector from "@/components/inventory/ProductSelector";
import QuantityInput from "@/components/inventory/QuantityInput";

// Existing Components
import InventorySession from "@/components/InventorySession";
import WeatherDashboard from "@/components/WeatherDashboard";
import CostAnalysisDashboard from "@/components/CostAnalysisDashboard";
import QuickBooksIntegration from "@/components/QuickBooksIntegration";
import SupplierAnalytics from "@/components/SupplierAnalytics";

import { useInventorySession } from "@/hooks/useInventorySession";
import { useLogger } from "@/hooks/useLogger";
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

  // L.O.G. Framework - Component Logging
  const { logUserAction, logError, trackOperation } = useLogger('InventoryPage');

  const handleProductSelected = (product: Product) => {
    const tracker = trackOperation('product_selection');
    try {
      setSelectedProduct(product);
      logUserAction('product_selected_main', { 
        productId: product.id, 
        sku: product.sku 
      });
      tracker.end({ success: true, productId: product.id });
    } catch (error: any) {
      logError(error, 'product_selection');
      tracker.end({ success: false, error: error.message });
    }
  };

  const handleProductCleared = () => {
    logUserAction('product_cleared_main', { 
      previousProduct: selectedProduct?.sku 
    });
    setSelectedProduct(null);
  };

  const handleQuantitySubmitted = (product: Product, quantity: number) => {
    const tracker = trackOperation('quantity_submission', { 
      productId: product.id, 
      quantity 
    });
    
    try {
      addItem(product, quantity, 100); // 100% confidence for manual entry
      
      logUserAction('inventory_item_added', {
        productId: product.id,
        productSku: product.sku,
        quantity,
        confidence: 100,
        method: 'manual'
      });

      // Clear selected product after successful addition
      setSelectedProduct(null);
      tracker.end({ success: true });
    } catch (error: any) {
      logError(error, 'quantity_submission', { 
        productId: product.id, 
        quantity 
      });
      tracker.end({ success: false, error: error.message });
    }
  };

  return (
    <div className="notepad-page min-h-screen p-8">
      {/* L.O.G. Framework - Modular Header Component */}
      <InventoryHeader 
        isWeatherDataActive={true}
        isVisionApiActive={false}
        sessionCount={session?.id || 0}
      />

      <main className="max-w-[2000px] mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4 2xl:gap-6 min-h-[calc(100vh-200px)]">
        
          {/* Left Column - L.O.G. Framework Input Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Session Status */}
            <Card className="notepad-card h-auto">
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

            {/* L.O.G. Framework - Product Selection Module */}
            <ProductSelector 
              selectedProduct={selectedProduct}
              onProductSelected={handleProductSelected}
              onProductCleared={handleProductCleared}
            />

            {/* L.O.G. Framework - Quantity Input Module */}
            <QuantityInput 
              selectedProduct={selectedProduct}
              onQuantitySubmitted={handleQuantitySubmitted}
              disabled={isLoading}
            />

            {/* Sync Controls */}
            <Card className="notepad-card">
              <CardHeader className="notepad-card-header">
                <CardTitle className="handwritten-title flex items-center">
                  <CloudUpload className="mr-2" />
                  Sync to MarginEdge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={syncToMarginEdge}
                  disabled={isLoading || sessionStats.itemCount === 0}
                  className="w-full notepad-button"
                  size="lg"
                >
                  <FolderSync className="w-4 h-4 mr-2" />
                  Upload Session
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {sessionStats.itemCount} items ready for upload
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Current Session */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="notepad-card flex-1">
              <CardHeader className="notepad-card-header">
                <CardTitle className="handwritten-title flex items-center">
                  <List className="mr-2" />
                  Current Session Items
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-100px)] overflow-hidden">
                <InventorySession items={sessionItems} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analytics Tabs */}
          <div className="xl:col-span-1 lg:col-span-2 xl:col-start-3">
            <Card className="notepad-card h-full">
              <CardHeader className="notepad-card-header">
                <CardTitle className="handwritten-title flex items-center">
                  <Info className="mr-2" />
                  Business Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-100px)] p-0">
                <Tabs defaultValue="weather" className="h-full">
                  <TabsList className="grid w-full grid-cols-5 bg-yellow-100 m-4 mb-0">
                    <TabsTrigger value="weather" className="handwritten-text text-xs">Weather</TabsTrigger>
                    <TabsTrigger value="cost" className="handwritten-text text-xs">Cost Analysis</TabsTrigger>
                    <TabsTrigger value="quickbooks" className="handwritten-text text-xs">QuickBooks</TabsTrigger>
                    <TabsTrigger value="supplier" className="handwritten-text text-xs">Suppliers</TabsTrigger>
                    <TabsTrigger value="pricing" className="handwritten-text text-xs">Pricing</TabsTrigger>
                  </TabsList>
                  
                  <div className="p-4 h-[calc(100%-60px)] overflow-y-auto">
                    <TabsContent value="weather" className="mt-0 h-full">
                      <WeatherDashboard />
                    </TabsContent>
                    
                    <TabsContent value="cost" className="mt-0 h-full">
                      <CostAnalysisDashboard />
                    </TabsContent>
                    
                    <TabsContent value="quickbooks" className="mt-0 h-full">
                      <QuickBooksIntegration />
                    </TabsContent>
                    
                    <TabsContent value="supplier" className="mt-0 h-full">
                      <SupplierAnalytics />
                    </TabsContent>
                    
                    <TabsContent value="pricing" className="mt-0 h-full">
                      <div className="text-center py-8">
                        <p className="handwritten-text text-gray-600">Pricing audit coming soon...</p>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}