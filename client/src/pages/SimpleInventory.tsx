/**
 * Simplified Inventory Interface for Booze Counter 9000
 * Streamlined layout with fewer buttons and cleaner UX
 */

import { useState, useCallback } from 'react';
import { Product } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { Package, Cloud, DollarSign, Link, Users, Scan } from 'lucide-react';
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
import { ErrorBoundary, ScannerErrorBoundary, NetworkErrorBoundary } from '@/components/ui/error-boundary';
import { ScanningLoadingState, WeatherLoadingState, AnalysisLoadingState, QuickBooksLoadingState, SupplierLoadingState } from '@/components/ui/loading-states';
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

  const handleProductSelected = useCallback((product: Product) => {
    setSelectedProduct(product);
    setAIEstimatedVolume(null);
    
    toast({
      title: "Product Selected",
      description: `${product.name} loaded successfully. AI features are now available.`,
    });
  }, [toast]);

  const handleQuantitySubmitted = useCallback((product: Product, quantity: number) => {
    console.log('Item added:', product.name, quantity);
    
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
              {/* AI Volume Estimator - Top Card */}
              {showAIFeatures && (
                <Card className="notebook-card lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="handwritten-title text-2xl">AI Visual Volume Estimator</CardTitle>
                    <CardDescription>Use camera to analyze product packaging and estimate quantities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AIVolumeEstimator
                      product={selectedProduct}
                      onVolumeEstimated={handleVolumeEstimated}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Barcode Scanner */}
              <Card className="notebook-card">
                <CardHeader>
                  <CardTitle className="handwritten-title text-2xl flex items-center gap-2">
                    <Scan className="w-6 h-6" />
                    Barcode Scanner
                  </CardTitle>
                  <CardDescription>Scan products for instant recognition</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScannerErrorBoundary>
                    {scannerMode === 'camera' ? (
                      <BarcodeScanner
                        onProductScanned={(product) => {
                          setSelectedProduct(product);
                          handleProductSelected(product);
                        }}
                      />
                    ) : (
                      <BarcodeScannerDemo
                        onProductScanned={(product) => {
                          setSelectedProduct(product);
                          handleProductSelected(product);
                        }}
                      />
                    )}
                  </ScannerErrorBoundary>
                  
                  {/* Simple toggle */}
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setScannerMode(scannerMode === 'camera' ? 'demo' : 'camera')}
                      size="sm"
                    >
                      {scannerMode === 'camera' ? 'Try Demo Mode' : 'Use Camera'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quantity Input */}
              {selectedProduct && (
                <Card className="notebook-card">
                  <CardHeader>
                    <CardTitle className="handwritten-title text-2xl">Enter Quantity</CardTitle>
                    <CardDescription>Count for {selectedProduct.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QuantityInput
                      product={selectedProduct}
                      onQuantitySubmitted={handleQuantitySubmitted}
                      initialQuantity={aiEstimatedVolume}
                    />
                    
                    {/* AI Volume Estimation Success */}
                    {aiEstimatedVolume && (
                      <div className="mt-4">
                        <AIInsight
                          type="success"
                          title="AI Volume Applied"
                          message={`Pre-filled with AI estimated volume: ${aiEstimatedVolume} units`}
                          confidence={85}
                          suggestions={['Verify the count manually', 'Adjust if needed', 'Submit when ready']}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
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
                <ErrorBoundary>
                  <CostAnalysisDashboard />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quickbooks">
            <Card className="notebook-card">
              <CardHeader>
                <CardTitle className="handwritten-title text-2xl">QuickBooks Integration</CardTitle>
                <CardDescription>Connect with QuickBooks for automated accounting</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorBoundary>
                  <QuickBooksIntegration />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
            <Card className="notebook-card">
              <CardHeader>
                <CardTitle className="handwritten-title text-2xl">Supplier Performance Analytics</CardTitle>
                <CardDescription>Track vendor performance and optimize supply chain</CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorBoundary>
                  <SupplierAnalytics />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}