/**
 * Demo Barcode Scanner - Shows functionality with real product barcodes
 */

import React, { useState } from 'react';
import { Scan, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const DEMO_BARCODES = [
  { barcode: "008807000013", name: "Heineken 24-Pack" },
  { barcode: "034100000017", name: "Budweiser 24-Pack" },
  { barcode: "0056000000019", name: "Corona Extra 24-Pack" },
  { barcode: "087116008502", name: "Grey Goose Vodka" },
  { barcode: "083085200012", name: "Jack Daniel's Whiskey" }
];

interface BarcodeScannerDemoProps {
  onProductScanned?: (product: any) => void;
}

export default function BarcodeScannerDemo({ onProductScanned }: BarcodeScannerDemoProps) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const simulateScan = async (barcode: string) => {
    setScanning(true);
    setResult(null);

    try {
      // Use the test-barcode endpoint directly with the barcode
      const response = await fetch(`/api/test-barcode/${barcode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        toast({
          title: "Product Found!",
          description: `${data.productName} - ${data.barcode}`,
        });
        
        // Call the callback if provided
        if (onProductScanned) {
          onProductScanned({
            name: data.productName,
            barcode: data.barcode,
            brand: data.brand,
            sku: data.sku,
            unitPrice: data.unitPrice
          });
        }
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Error",
        description: "Failed to scan barcode",
        variant: "destructive"
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Scan className="w-5 h-5" />
          Demo Barcode Scanner
        </h4>
        
        <p className="text-sm text-muted-foreground mb-4">
          Click a product to simulate scanning its barcode
        </p>

        <div className="space-y-2">
          {DEMO_BARCODES.map((item) => (
            <Button
              key={item.barcode}
              onClick={() => simulateScan(item.barcode)}
              variant="outline"
              className="w-full justify-start gap-2"
              disabled={scanning}
            >
              <Package className="w-4 h-4" />
              <span className="flex-1 text-left">{item.name}</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {item.barcode}
              </Badge>
            </Button>
          ))}
        </div>
      </Card>

      {result && (
        <Card className={`p-4 ${result.success ? 'border-green-500' : 'border-red-500'}`}>
          <h5 className="font-semibold mb-2">Scan Result</h5>
          {result.success ? (
            <div className="space-y-1 text-sm">
              <p><strong>Barcode:</strong> {result.barcode}</p>
              <p><strong>Product:</strong> {result.productName}</p>
              {result.brand && <p><strong>Brand:</strong> {result.brand}</p>}
              <p><strong>Source:</strong> {result.message || result.source}</p>
              <Badge className="mt-2">{result.confidence}% Confidence</Badge>
            </div>
          ) : (
            <p className="text-sm text-red-600">{result.message || "No product found"}</p>
          )}
        </Card>
      )}
    </div>
  );
}