/**
 * Simplified Inventory Interface for Booze Counter 9000
 * Single-page layout with tabbed navigation for better mobile UX
 */

import { useState, useCallback } from 'react';
import { Product } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { Package, Cloud, DollarSign, Link, Users, Scan } from 'lucide-react';
import ProductSelector from '@/components/inventory/ProductSelector';
import QuantityInput from '@/components/inventory/QuantityInput';
import WeatherDashboard from '@/components/WeatherDashboard';
import CostAnalysisDashboard from '@/components/CostAnalysisDashboard';
import QuickBooksIntegration from '@/components/QuickBooksIntegration';
import SupplierAnalytics from '@/components/SupplierAnalytics';
import BarcodeScanner from '@/components/inventory/BarcodeScanner';
import BarcodeScannerDemo from '@/components/inventory/BarcodeScannerDemo';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorBoundary, ProductErrorBoundary, ScannerErrorBoundary, NetworkErrorBoundary } from '@/components/ui/error-boundary';
import { ProductLoadingState, ScanningLoadingState, WeatherLoadingState, AnalysisLoadingState, QuickBooksLoadingState, SupplierLoadingState } from '@/components/ui/loading-states';
import { AIInsight, SmartRecommendations, AIVolumeEstimator } from '@/components/ui/ai-feedback';
import { useToast } from '@/hooks/use-toast';

type TabValue = 'inventory' | 'weather' | 'cost' | 'quickbooks' | 'suppliers';

export default function SimpleInventory() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [scannerMode, setScannerMode] = useState<'camera' | 'demo'>('demo');
  const [activeTab, setActiveTab] = useState<TabValue>('inventory');
  const [aiEstimatedVolume, setAIEstimatedVolume] = useState<number | null>(null);
  const [showAIFeatures, setShowAIFeatures] = useState(true);
  const { toast } = useToast();

  // Fetch products with error handling
  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const handleProductSelected = useCallback((product: Product) => {
    setSelectedProduct(product);
    setAIEstimatedVolume(null);
    
    // Show AI insight when product is selected
    if (showAIFeatures) {
      toast({
        title: "Product Selected",
        description: `${product.name} loaded successfully. AI features are now available.`,
      });
    }
  }, [showAIFeatures, toast]);

  const handleQuantitySubmitted = useCallback((product: Product, quantity: number) => {
    console.log('Item added:', product.name, quantity);
    
    // Show success feedback
    toast({
      title: "Item Added",
      description: `${quantity} units of ${product.name} added to inventory.`,
    });
    
    // Reset for next item
    setSelectedProduct(null);
    setAIEstimatedVolume(null);
  }, [toast]);

  const handleVolumeEstimated = useCallback((volume: number) => {
    setAIEstimatedVolume(volume);
    toast({
      title: "AI Volume Estimated",
      description: `AI suggests ${volume} units based on image analysis.`,
    });
  }, [toast]);

  // Smart recommendations data
  const smartRecommendations = [
    {
      title: "Reorder Alert: Heineken Beer",
      description: "Stock levels are low. Weather forecast shows hot weekend ahead, increasing demand by 35%.",
      impact: "high" as const
    },
    {
      title: "Pricing Optimization",
      description: "Consider raising wine prices by 8% based on competitor analysis and demand patterns.",
      impact: "medium" as const
    },
    {
      title: "Seasonal Adjustment",
      description: "Summer cocktail supplies should be increased by 20% for the next month.",
      impact: "medium" as const
    }
  ];

  return (
    <div className="min-h-screen notebook-bg p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 handwritten-title">
          Booze Counter 9000
        </h1>
        <p className="text-center text-lg text-muted-foreground handwritten-text">
          Professional Inventory Management System
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="quickbooks" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              <span className="hidden sm:inline">QuickBooks</span>
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Suppliers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Smart Recommendations */}
            {showAIFeatures && (
              <SmartRecommendations recommendations={smartRecommendations} />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Selection */}
              <Card className="notebook-card">
                <CardHeader>
                  <CardTitle className="handwritten-title text-2xl">Product Selection</CardTitle>
                  <CardDescription>Scan a barcode or search for products</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Barcode Scanner Section */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Scan className="w-5 h-5" />
                      Barcode Scanner
                    </h4>
                    
                    {/* Scanner Mode Toggle */}
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={scannerMode === 'camera' ? 'default' : 'outline'}
                        onClick={() => setScannerMode('camera')}
                        size="sm"
                      >
                        Camera Scanner
                      </Button>
                      <Button
                        variant={scannerMode === 'demo' ? 'default' : 'outline'}
                        onClick={() => setScannerMode('demo')}
                        size="sm"
                      >
                        Demo Mode
                      </Button>
                    </div>
                    
                    <ScannerErrorBoundary>
                      {scannerMode === 'camera' ? (
                        <BarcodeScanner
                          onProductScanned={(product) => {
                            setSelectedProduct(product);
                            handleProductSelected(product);
                          }}
                          onBarcodeDetected={(barcode) => {
                            console.log('Barcode detected:', barcode);
                          }}
                        />
                      ) : (
                        <BarcodeScannerDemo />
                      )}
                    </ScannerErrorBoundary>
                  </div>

                  {/* Product Search */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Product Search</h4>
                    <ProductErrorBoundary>
                      {productsLoading ? (
                        <ProductLoadingState />
                      ) : productsError ? (
                        <AIInsight
                          type="warning"
                          title="Product Loading Error"
                          message="Unable to load products. Please check your connection and try again."
                          suggestions={['Check internet connection', 'Refresh the page', 'Contact support if problem persists']}
                        />
                      ) : (
                        <ProductSelector
                          products={products}
                          onProductSelected={handleProductSelected}
                        />
                      )}
                    </ProductErrorBoundary>
                  </div>

                  {/* Quantity Input */}
                  {selectedProduct && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Enter Quantity</h4>
                      <QuantityInput
                        product={selectedProduct}
                        onQuantitySubmitted={handleQuantitySubmitted}
                        initialQuantity={aiEstimatedVolume}
                      />
                      
                      {/* AI Volume Estimation Success */}
                      {aiEstimatedVolume && (
                        <AIInsight
                          type="success"
                          title="AI Volume Applied"
                          message={`Pre-filled with AI estimated volume: ${aiEstimatedVolume} units`}
                          confidence={85}
                          suggestions={['Verify the count manually', 'Adjust if needed', 'Submit when ready']}
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* AI Features Panel */}
              {showAIFeatures && selectedProduct && (
                <AIVolumeEstimator
                  product={selectedProduct}
                  onVolumeEstimated={handleVolumeEstimated}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="weather">
            <Card className="notebook-card">
              <CardHeader>
                <CardTitle className="handwritten-title text-2xl">Weather-Based Demand Forecasting</CardTitle>
                <CardDescription>Smart inventory predictions based on weather patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkErrorBoundary>
                  <WeatherDashboard />
                </NetworkErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cost">
            <Card className="notebook-card">
              <CardHeader>
                <CardTitle className="handwritten-title text-2xl">Cost Analysis Dashboard</CardTitle>
                <CardDescription>Real-time profit margins and pricing insights</CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkErrorBoundary>
                  <CostAnalysisDashboard />
                </NetworkErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quickbooks">
            <Card className="notebook-card">
              <CardHeader>
                <CardTitle className="handwritten-title text-2xl">QuickBooks Integration</CardTitle>
                <CardDescription>Sync your inventory data with accounting</CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkErrorBoundary>
                  <QuickBooksIntegration />
                </NetworkErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
            <Card className="notebook-card">
              <CardHeader>
                <CardTitle className="handwritten-title text-2xl">Supplier Performance</CardTitle>
                <CardDescription>Track vendor reliability and pricing trends</CardDescription>
              </CardHeader>
              <CardContent>
                <NetworkErrorBoundary>
                  <SupplierAnalytics />
                </NetworkErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}