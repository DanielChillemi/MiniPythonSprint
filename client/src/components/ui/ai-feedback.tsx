/**
 * AI Feedback Components for Simulated Intelligence Features
 * Provides realistic AI-powered feedback and suggestions
 */

import { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Zap, Camera, Video, StopCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Alert, AlertDescription } from './alert';

interface AIInsightProps {
  type: 'success' | 'warning' | 'info' | 'analysis';
  title: string;
  message: string;
  confidence?: number;
  suggestions?: string[];
}

export function AIInsight({ type, title, message, confidence, suggestions }: AIInsightProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const typeConfig = {
    success: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    info: { icon: Brain, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    analysis: { icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-50' }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <Alert className={`${config.bgColor} border-l-4 border-l-current`}>
        <div className="flex items-start space-x-3">
          <Icon className={`w-5 h-5 ${config.color} mt-0.5`} />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold">{title}</h4>
              <Sparkles className="w-4 h-4 text-yellow-500" />
              {confidence && (
                <Badge variant="secondary" className="text-xs">
                  {confidence}% confident
                </Badge>
              )}
            </div>
            <AlertDescription>{message}</AlertDescription>
            {suggestions && suggestions.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-sm font-medium">AI Suggestions:</p>
                <ul className="text-sm space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-primary">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
}

export function AIProcessingStatus({ status, message }: { status: 'processing' | 'complete' | 'error'; message: string }) {
  const statusConfig = {
    processing: { icon: Brain, color: 'text-blue-600', pulse: true },
    complete: { icon: CheckCircle, color: 'text-green-600', pulse: false },
    error: { icon: AlertTriangle, color: 'text-red-600', pulse: false }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Icon className={`w-4 h-4 ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
      <span>{message}</span>
    </div>
  );
}

export function SmartRecommendations({ recommendations }: { recommendations: Array<{ title: string; description: string; impact: 'high' | 'medium' | 'low' }> }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recommendations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [recommendations.length]);

  if (recommendations.length === 0) return null;

  const current = recommendations[currentIndex];
  const impactColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <Card className="notebook-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>Smart Recommendations</span>
          <Badge variant="outline" className="text-xs">
            {currentIndex + 1} of {recommendations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-semibold">{current.title}</h4>
            <Badge className={impactColors[current.impact]}>
              {current.impact} impact
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{current.description}</p>
          
          {/* Progress indicator */}
          <div className="flex space-x-1 mt-4">
            {recommendations.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded transition-colors duration-300 ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AIVolumeEstimator({ product, onVolumeEstimated }: { product: any; onVolumeEstimated: (volume: number) => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      // Check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.log('Camera error details:', error);
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        alert('Camera permission denied. Please:\n1. Click the camera icon in your browser address bar\n2. Allow camera access\n3. Refresh the page and try again\n\nOr use the Demo button instead.');
      } else if (errorMessage.includes('NotFoundError')) {
        alert('No camera found. Please make sure your device has a camera or use the Demo button.');
      } else if (errorMessage.includes('NotSupportedError')) {
        alert('Camera not supported by this browser. Please try Chrome, Firefox, or Safari, or use the Demo button.');
      } else if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        alert('Camera requires HTTPS connection. Please use the Demo button instead.');
      } else {
        alert(`Camera error: ${errorMessage}\n\nPlease try the Demo button for AI analysis without camera.`);
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const performVolumeEstimation = async (useDemo = false) => {
    setIsProcessing(true);
    
    try {
      let imageData = '';
      
      if (!useDemo && videoRef.current && canvasRef.current) {
        // Real camera mode
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context) {
          // Set canvas size to match video
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw video frame to canvas
          context.drawImage(video, 0, 0);
          
          // Convert to base64
          imageData = canvas.toDataURL('image/jpeg', 0.8);
        }
      } else {
        // Demo mode - use a small placeholder image
        imageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';
      }
      
      const response = await fetch('/api/ai-volume-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageData,
          productInfo: product 
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setConfidence(result.confidence);
        setAnalysis(result.analysis);
        onVolumeEstimated(result.estimatedVolume);
        
        if (isCapturing) {
          stopCamera();
        }
      }
    } catch (error) {
      console.error('Volume estimation failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="notebook-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>AI Visual Volume Estimator</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use Google Cloud Vision API to estimate product volume from camera analysis
            </p>
            <div className="text-xs bg-green-50 p-2 rounded border border-green-200">
              ✅ <strong>Demo Mode Available:</strong> The <strong>Demo</strong> button provides full AI analysis without camera access
            </div>
          </div>
          
          {/* Camera controls */}
          <div className="space-y-2">
            {/* Security warning for non-HTTPS */}
            {location.protocol !== 'https:' && location.hostname !== 'localhost' && (
              <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                ⚠️ Camera requires HTTPS or localhost. Use demo mode if camera doesn't work.
              </div>
            )}
            
            <div className="flex space-x-2">
              {!isCapturing ? (
                <>
                  <button
                    onClick={startCamera}
                    disabled={isProcessing}
                    className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Start Camera</span>
                    </span>
                  </button>
                  <button
                    onClick={() => performVolumeEstimation(true)}
                    disabled={isProcessing}
                    className="py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Demo</span>
                    </span>
                  </button>
                </>
              ) : (
              <>
                <button
                  onClick={performVolumeEstimation}
                  disabled={isProcessing}
                  className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Brain className="w-4 h-4 animate-pulse" />
                      <span>AI Analyzing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>Estimate Volume</span>
                    </span>
                  )}
                </button>
                <button
                  onClick={stopCamera}
                  disabled={isProcessing}
                  className="py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <StopCircle className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          </div>
          
          {/* Camera preview */}
          {isCapturing && (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-48 object-cover rounded-lg bg-gray-100"
              />
              <div className="absolute inset-0 border-2 border-dashed border-purple-400 rounded-lg flex items-center justify-center bg-purple-100/20">
                <div className="text-purple-600 text-sm font-medium">
                  Point camera at product packaging
                </div>
              </div>
            </div>
          )}
          
          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} className="hidden" />
          
          {confidence !== null && (
            <AIInsight
              type="success"
              title="Volume Estimated"
              message={`AI has analyzed the product and estimated the volume with ${confidence}% confidence.`}
              confidence={confidence}
              suggestions={[
                'Verify count manually for accuracy',
                'Consider adjusting for packaging variations',
                'Update inventory tracking system'
              ]}
            />
          )}
          
          {analysis && (
            <div className="text-xs text-muted-foreground space-y-1">
              <div><strong>Analysis Method:</strong> {analysis.method}</div>
              <div><strong>Packaging Type:</strong> {analysis.packagingType}</div>
              {analysis.objectsDetected && (
                <div><strong>Objects Detected:</strong> {analysis.objectsDetected}</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}