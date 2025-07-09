/**
 * Magical Interactive Book Interface for Booze Counter 9000
 * Using react-pageflip for realistic page turning
 */

import { useRef, useState, useCallback, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Product } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, BookOpen, Home } from 'lucide-react';
import ProductSelector from '@/components/inventory/ProductSelector';
import QuantityInput from '@/components/inventory/QuantityInput';
import WeatherDashboard from '@/components/WeatherDashboard';
import CostAnalysisDashboard from '@/components/CostAnalysisDashboard';
import QuickBooksIntegration from '@/components/QuickBooksIntegration';
import SupplierAnalytics from '@/components/SupplierAnalytics';

// Page component wrapper
const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; pageNumber?: number }>(
  ({ children, pageNumber }, ref) => {
    return (
      <div ref={ref} className="book-page">
        {children}
        {pageNumber && (
          <div className={`page-number ${pageNumber % 2 === 0 ? 'page-number-left' : 'page-number-right'}`}>
            {pageNumber}
          </div>
        )}
      </div>
    );
  }
);

Page.displayName = 'Page';

// Book Cover component
const BookCover = forwardRef<HTMLDivElement, { title: string; subtitle: string }>(
  ({ title, subtitle }, ref) => {
    return (
      <div ref={ref} className="book-cover book-page">
        <div className="ornament">⚜️</div>
        <h1 className="book-title gold-text">{title}</h1>
        <h2 className="book-subtitle">{subtitle}</h2>
        <div className="ornament">⚜️</div>
        <div style={{ marginTop: 'auto' }}>
          <p className="book-subtitle" style={{ fontSize: '1rem', opacity: 0.7 }}>
            Professional Inventory Management System
          </p>
        </div>
      </div>
    );
  }
);

BookCover.displayName = 'BookCover';

export default function BookInventory() {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Fetch products
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Navigation functions
  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip().flipNext();
  }, []);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip().flipPrev();
  }, []);

  const flipToPage = useCallback((pageNum: number) => {
    bookRef.current?.pageFlip().flip(pageNum);
  }, []);

  const handleProductSelected = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleQuantitySubmitted = useCallback((product: Product, quantity: number) => {
    console.log('Item added:', product.name, quantity);
    // Add your inventory logic here
  }, []);

  return (
    <div className="book-container">
      <div className="book-shadow" />
      
      {/* Navigation Controls */}
      <div className="fixed top-8 left-8 z-50 flex gap-4">
        <button
          onClick={() => flipToPage(0)}
          className="book-button flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Cover
        </button>
        <button
          onClick={() => flipToPage(2)}
          className="book-button flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Contents
        </button>
      </div>

      {/* Page indicator */}
      <div className="fixed top-8 right-8 z-50 text-ink-secondary">
        Page {currentPage + 1} of 12
      </div>

      {/* Page flip controls */}
      <button
        onClick={flipPrev}
        className="fixed left-8 top-1/2 -translate-y-1/2 z-50 book-button rounded-full p-3"
        disabled={currentPage === 0}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={flipNext}
        className="fixed right-8 top-1/2 -translate-y-1/2 z-50 book-button rounded-full p-3"
        disabled={currentPage >= 11}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* The Book */}
      <HTMLFlipBook
        ref={bookRef}
        width={500}
        height={700}
        size="fixed"
        minWidth={315}
        maxWidth={1000}
        minHeight={420}
        maxHeight={1350}
        showCover={true}
        flippingTime={1000}
        usePortrait={true}
        startZIndex={0}
        autoSize={false}
        maxShadowOpacity={0.5}
        showPageCorners={true}
        disableFlipByClick={false}
        className="book-flip"
        style={{}}
        startPage={0}
        drawShadow={true}
        useMouseEvents={true}
        renderOnlyPageLengthChange={false}
        swipeDistance={30}
        clickEventForward={true}
        onFlip={(e) => setCurrentPage(e.data)}
      >
        {/* Front Cover */}
        <BookCover
          title="Booze Counter 9000"
          subtitle="Inventory Management Grimoire"
        />

        {/* Title Page */}
        <Page pageNumber={1}>
          <div className="text-center">
            <h1 className="chapter-header">Booze Counter 9000</h1>
            <p className="text-lg mb-8">Advanced Inventory Management System</p>
            <div className="ornament">⚡</div>
            <p className="mt-8 text-sm italic">Version 2.1 • Resonance Framework</p>
          </div>
        </Page>

        {/* Table of Contents */}
        <Page pageNumber={2}>
          <h2 className="chapter-header">Table of Contents</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-neutral-300">
              <span>Chapter 1: Product Selection</span>
              <span>Page 3</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-300">
              <span>Chapter 2: Quantity Entry</span>
              <span>Page 4</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-300">
              <span>Chapter 3: Weather Analytics</span>
              <span>Page 5</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-300">
              <span>Chapter 4: Cost Analysis</span>
              <span>Page 6</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-300">
              <span>Chapter 5: QuickBooks Integration</span>
              <span>Page 7</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-neutral-300">
              <span>Chapter 6: Supplier Performance</span>
              <span>Page 8</span>
            </div>
          </div>
        </Page>

        {/* Chapter 1: Product Selection */}
        <Page pageNumber={3}>
          <h2 className="chapter-header">Chapter 1</h2>
          <h3 className="section-title text-center mb-8">Product Selection</h3>
          <ProductSelector
            selectedProduct={selectedProduct}
            onProductSelected={handleProductSelected}
            onProductCleared={() => setSelectedProduct(null)}
          />
        </Page>

        {/* Chapter 2: Quantity Entry */}
        <Page pageNumber={4}>
          <h2 className="chapter-header">Chapter 2</h2>
          <h3 className="section-title text-center mb-8">Quantity Entry</h3>
          <QuantityInput
            selectedProduct={selectedProduct}
            onQuantitySubmitted={handleQuantitySubmitted}
            disabled={false}
          />
          {!selectedProduct && (
            <div className="text-center mt-8 text-ink-secondary italic">
              Please select a product from Chapter 1 first
            </div>
          )}
        </Page>

        {/* Chapter 3: Weather Analytics */}
        <Page pageNumber={5}>
          <h2 className="chapter-header">Chapter 3</h2>
          <h3 className="section-title text-center mb-8">Weather Intelligence</h3>
          <div className="book-section" style={{ height: '500px', overflow: 'auto' }}>
            <WeatherDashboard />
          </div>
        </Page>

        {/* Chapter 4: Cost Analysis */}
        <Page pageNumber={6}>
          <h2 className="chapter-header">Chapter 4</h2>
          <h3 className="section-title text-center mb-8">Cost Analysis</h3>
          <div className="book-section" style={{ height: '500px', overflow: 'auto' }}>
            <CostAnalysisDashboard />
          </div>
        </Page>

        {/* Chapter 5: QuickBooks */}
        <Page pageNumber={7}>
          <h2 className="chapter-header">Chapter 5</h2>
          <h3 className="section-title text-center mb-8">QuickBooks Sync</h3>
          <div className="book-section" style={{ height: '500px', overflow: 'auto' }}>
            <QuickBooksIntegration />
          </div>
        </Page>

        {/* Chapter 6: Supplier Analytics */}
        <Page pageNumber={8}>
          <h2 className="chapter-header">Chapter 6</h2>
          <h3 className="section-title text-center mb-8">Supplier Performance</h3>
          <div className="book-section" style={{ height: '500px', overflow: 'auto' }}>
            <SupplierAnalytics />
          </div>
        </Page>

        {/* Session Summary */}
        <Page pageNumber={9}>
          <h2 className="chapter-header">Session Summary</h2>
          <div className="book-section">
            <div className="book-card">
              <h3 className="section-title">Today's Inventory Count</h3>
              <p>Items Counted: 0</p>
              <p>Total Value: $0.00</p>
              <p>Session Duration: 0 minutes</p>
            </div>
            <button className="book-button w-full mt-4">
              Sync to MarginEdge
            </button>
          </div>
        </Page>

        {/* Notes Page */}
        <Page pageNumber={10}>
          <h2 className="chapter-header">Notes & Observations</h2>
          <div className="space-y-4">
            <textarea
              className="w-full h-64 p-4 book-input"
              placeholder="Write your inventory notes here..."
              style={{ borderStyle: 'solid', borderRadius: '8px' }}
            />
            <button className="book-button">Save Notes</button>
          </div>
        </Page>

        {/* Credits */}
        <Page pageNumber={11}>
          <div className="text-center">
            <h2 className="chapter-header">Credits</h2>
            <div className="ornament">✨</div>
            <p className="mt-8">Built with React & Magic</p>
            <p className="mt-4 text-sm">Powered by L.O.G. Framework</p>
            <p className="mt-2 text-sm">Resonance v2.1</p>
          </div>
        </Page>

        {/* Back Cover */}
        <Page pageNumber={12}>
          <div className="book-cover flex items-center justify-center">
            <div className="text-center">
              <div className="ornament text-4xl">🔮</div>
              <p className="book-subtitle mt-4">The End</p>
            </div>
          </div>
        </Page>
      </HTMLFlipBook>
    </div>
  );
}