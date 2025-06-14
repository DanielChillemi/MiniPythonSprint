import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileScan, Mic, MicOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

interface ProductLookupProps {
  onProductFound: (product: Product) => void;
}

export default function ProductLookup({ onProductFound }: ProductLookupProps) {
  const [productId, setProductId] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const { data: product, isLoading, refetch } = useQuery({
    queryKey: [`/api/products/search/${productId}`],
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

  const startVoiceInput = async () => {
    try {
      setIsListening(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        
        try {
          // Convert blob to base64
          const arrayBuffer = await audioBlob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          let binaryString = '';
          for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
          }
          const base64Audio = btoa(binaryString);

          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audioData: base64Audio
            }),
            credentials: 'include',
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.transcript) {
              // Use the raw transcript for searching (no cleaning needed for name search)
              setProductId(result.transcript.trim());
              
              toast({
                title: "Voice Recognition",
                description: `Heard: "${result.transcript}"`,
              });
            }
          }
        } catch (error) {
          console.error('Voice recognition error:', error);
          toast({
            title: "Voice Recognition Failed",
            description: "Please try again or type manually",
            variant: "destructive"
          });
        }
        
        setIsListening(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      // Auto-stop after 3 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 3000);
      
    } catch (error) {
      setIsListening(false);
      toast({
        title: "Microphone Access",
        description: "Please allow microphone access to use voice input",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Say product name, scan barcode, or type (e.g. 'Corona', 'Jack Daniels')"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pr-20 text-lg py-3 border-2 handwritten-text bg-yellow-50"
        />
        <div className="absolute right-2 top-2 flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:text-primary"
            onClick={startVoiceInput}
            disabled={isListening}
          >
            {isListening ? (
              <MicOff className="h-5 w-5 text-red-500 animate-pulse" />
            ) : (
              <Mic className="h-5 w-5 text-orange-600" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-400 hover:text-primary"
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
      </div>
      
      <Button 
        onClick={handleLookup}
        disabled={isLoading || !productId.trim()}
        className="w-full py-3 font-medium handwritten-text bg-yellow-200 border-2 border-dashed border-gray-400 hover:bg-yellow-300"
      >
        {isLoading ? "Looking up..." : "Lookup Product"}
      </Button>
    </div>
  );
}
