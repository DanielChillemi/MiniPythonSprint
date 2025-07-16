/**
 * Simplified Inventory Interface for Booze Counter 9000
 * Single-page layout with tabbed navigation for better mobile UX
 */

import { useState, useCallback } from 'react';
import { Product } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import ProductSelector from '@/components/inventory/ProductSelector';
import QuantityInput from '@/components/inventory/QuantityInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductErrorBoundary } from '@/components/ui/error-boundary';
import { ProductLoadingState } from '@/components/ui/loading-states';
import { AIVolumeEstimator } from '@/components/ui/ai-feedback';
import { useToast } from '@/hooks/use-toast';

export default function SimpleInventory() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [aiEstimatedVolume, setAIEstimatedVolume] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch products with error handling
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const handleProductSelected = useCallback((product: Product) => {
    setSelectedProduct(product);
    setAIEstimatedVolume(null);
    
    toast({
      title: "Product Selected",
      description: `${product.name} ready for AI counting.`,
    });
  }, [toast]);

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

  return (
    <div className="min-h-screen notebook-bg p-4 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 handwritten-title">
          Booze Counter 9000
        </h1>
        <p className="text-center text-lg text-muted-foreground handwritten-text">
          AI-Powered Inventory Counting
        </p>
      </div>

      {/* Main Content - Simplified Layout */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Product Selection */}
        <Card className="notebook-card">
          <CardHeader>
            <CardTitle className="handwritten-title text-2xl">Select Product</CardTitle>
            <CardDescription>Search for products to count</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductErrorBoundary>
              {productsLoading ? (
                <ProductLoadingState />
              ) : (
                <ProductSelector
                  products={products}
                  onProductSelected={handleProductSelected}
                />
              )}
            </ProductErrorBoundary>
          </CardContent>
        </Card>

        {/* AI Volume Estimator - Main Feature */}
        {selectedProduct && (
          <Card className="notebook-card border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="handwritten-title text-2xl text-primary">
                🤖 AI Volume Estimator
              </CardTitle>
              <CardDescription>
                Point your camera at {selectedProduct.name} packaging for instant AI counting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIVolumeEstimator
                product={selectedProduct}
                onVolumeEstimated={handleVolumeEstimated}
              />
            </CardContent>
          </Card>
        )}

        {/* Quantity Input */}
        {selectedProduct && (
          <Card className="notebook-card">
            <CardHeader>
              <CardTitle className="handwritten-title text-2xl">Enter Quantity</CardTitle>
              <CardDescription>
                {aiEstimatedVolume 
                  ? `AI suggests ${aiEstimatedVolume} units - verify or adjust` 
                  : 'Manually enter the quantity'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuantityInput
                product={selectedProduct}
                onQuantitySubmitted={handleQuantitySubmitted}
                suggestedQuantity={aiEstimatedVolume}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}