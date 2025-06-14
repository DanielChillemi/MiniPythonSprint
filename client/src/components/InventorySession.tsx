import { Wine, Coffee, Beer } from "lucide-react";
import { InventoryItem, Product } from "@shared/schema";

interface InventorySessionItem extends InventoryItem {
  product?: Product;
}

interface InventorySessionProps {
  items: InventorySessionItem[];
}

export default function InventorySession({ items }: InventorySessionProps) {
  const getProductIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'wine':
        return <Wine className="w-4 h-4" />;
      case 'beer':
        return <Beer className="w-4 h-4" />;
      case 'spirits':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Coffee className="w-4 h-4" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Coffee className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No items counted yet</p>
        <p className="text-xs">Start by scanning a product barcode</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded flex items-center justify-center">
              {getProductIcon(item.product?.category)}
            </div>
            <div>
              <p className="font-medium text-sm">
                {item.product?.name || `Product ${item.productId}`}
              </p>
              <p className="text-xs text-gray-600">
                {formatTime(item.recordedAt)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{item.quantity} units</p>
            <p className="text-xs text-gray-600">${item.totalValue}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
