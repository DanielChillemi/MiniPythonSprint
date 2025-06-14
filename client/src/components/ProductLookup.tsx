import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileScan } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

interface ProductLookupProps {
  onProductFound: (product: Product) => void;
}

export default function ProductLookup({ onProductFound }: ProductLookupProps) {
  const [productId, setProductId] = useState("");
  const { toast } = useToast();

  const { data: product, isLoading, refetch } = useQuery({
    queryKey: [`/api/products/sku/${productId}`],
    enabled: false,
  });

  const handleLookup = async () => {
    if (!productId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a product ID or scan a barcode",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await refetch();
      if (result.data) {
        onProductFound(result.data);
        toast({
          title: "Product Found",
          description: `${result.data.name} loaded successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Product Not Found",
        description: "Please check the ID and try again",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Scan barcode or enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pr-12 text-lg py-3 border-2"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 p-2 text-gray-400 hover:text-primary"
          onClick={() => {
            // Simulate barcode scanner - in real implementation would open camera
            const mockBarcodes = ["VDK-GG-750", "BEER-COR-24", "WINE-CAB-750"];
            const randomSku = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
            setProductId(randomSku);
          }}
        >
          <FileScan className="h-5 w-5" />
        </Button>
      </div>
      
      <Button 
        onClick={handleLookup}
        disabled={isLoading || !productId.trim()}
        className="w-full py-3 font-medium ripple"
      >
        {isLoading ? "Looking up..." : "Lookup Product"}
      </Button>
    </div>
  );
}
