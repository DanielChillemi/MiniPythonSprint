/**
 * L.O.G. Framework - Granular Component: Quantity Input
 * Single Responsibility: Handle quantity input and validation
 */

import React, { useState } from "react";
import { Hash, Check, Package2 } from "lucide-react";
import { Product } from "@shared/schema";
import { useLogger } from "@/hooks/useLogger";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface QuantityInputProps {
  selectedProduct?: Product | null;
  product?: Product;
  onQuantitySubmitted: (product: Product, quantity: number) => void;
  disabled?: boolean;
  initialQuantity?: number | null;
}

const quantitySchema = z.object({
  quantity: z.coerce.number()
    .min(0.01, "Quantity must be greater than 0")
    .max(10000, "Quantity seems unusually large")
});

function QuantityInput({ 
  selectedProduct, 
  product,
  onQuantitySubmitted, 
  disabled = false,
  initialQuantity = null
}: QuantityInputProps) {
  const { logUserAction, logError, trackOperation } = useLogger('QuantityInput');
  const currentProduct = product || selectedProduct;
  
  const form = useForm<z.infer<typeof quantitySchema>>({
    resolver: zodResolver(quantitySchema),
    defaultValues: {
      quantity: initialQuantity || 0
    }
  });

  // Update form when initialQuantity changes
  React.useEffect(() => {
    if (initialQuantity !== null) {
      form.setValue('quantity', initialQuantity);
    }
  }, [initialQuantity, form]);

  const handleSubmit = form.handleSubmit((data) => {
    if (!currentProduct) return;
    
    const tracker = trackOperation('submit_quantity', {
      productId: currentProduct.id,
      quantity: data.quantity
    });

    try {
      onQuantitySubmitted(currentProduct, data.quantity);
      
      logUserAction('quantity_submitted', {
        productId: currentProduct.id,
        productSku: currentProduct.sku,
        quantity: data.quantity,
        inputMethod: initialQuantity ? 'ai_assisted' : 'manual'
      });

      // Reset form
      form.reset();
      tracker.end({ success: true });
    } catch (error: any) {
      logError(error, 'quantity_submission', {
        productId: currentProduct.id,
        quantity: data.quantity
      });
      tracker.end({ success: false, error: error.message });
    }
  });

  return (
    <div className="book-card">
      <div className="flex items-center mb-6">
        <div className="glass-panel p-3 rounded-full mr-3">
          <Hash className="w-6 h-6 text-green-500" />
        </div>
        <h2 className="text-2xl marker-title">Quantity Entry</h2>
      </div>
      
      <AnimatePresence mode="wait">
        {currentProduct ? (
          <motion.div
            key="quantity-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <div className="glass-panel p-5 rounded-lg text-center">
              <p className="sketch-text mb-2">Enter quantity for:</p>
              <p className="text-xl marker-text font-bold highlight highlight-pink">
                {currentProduct.name}
              </p>
              {initialQuantity && (
                <p className="text-sm text-blue-600 mt-2">
                  AI suggested: {initialQuantity} units
                </p>
              )}
            </div>

            <Form {...form}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          {...field}
                          type="number"
                          placeholder="0"
                          className="w-full text-center text-4xl font-bold marker-text glass-panel py-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          autoFocus
                          min="0"
                          step="1"
                        />
                      </FormControl>
                      <FormDescription className="text-center sketch-text mt-2">
                        Press Enter to confirm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button 
                  type="submit" 
                  disabled={disabled}
                  className="w-full future-button py-4 text-lg"
                >
                  <Check className="w-5 h-5 mr-2 inline" />
                  Confirm Quantity
                </button>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="no-product"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <div className="glass-panel p-8 rounded-full mx-auto w-fit mb-4">
              <Package2 className="w-16 h-16 text-gray-400" />
            </div>
            <p className="sketch-text text-lg">
              Select a product to enter quantity
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(QuantityInput);