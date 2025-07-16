/**
 * AI Feedback Components for Simulated Intelligence Features
 * Provides realistic AI-powered feedback and suggestions
 */

import { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
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

  const simulateVolumeEstimation = () => {
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const estimatedVolume = Math.floor(Math.random() * 50) + 10; // Random volume between 10-60
      const estimatedConfidence = Math.floor(Math.random() * 30) + 70; // Confidence between 70-100%
      
      setConfidence(estimatedConfidence);
      setIsProcessing(false);
      onVolumeEstimated(estimatedVolume);
    }, 2000);
  };

  return (
    <Card className="notebook-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span>AI Volume Estimator</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use AI to estimate product volume from image analysis
          </p>
          
          <button
            onClick={simulateVolumeEstimation}
            disabled={isProcessing}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center space-x-2">
                <Brain className="w-4 h-4 animate-pulse" />
                <span>AI Processing...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Estimate Volume</span>
              </span>
            )}
          </button>
          
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
        </div>
      </CardContent>
    </Card>
  );
}