/**
 * L.O.G. Framework - Granular Component: Inventory Header
 * Single Responsibility: Display application header with navigation
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Package2, Map } from "lucide-react";
import { Link } from "wouter";
import { useLogger } from "@/hooks/useLogger";

interface InventoryHeaderProps {
  isWeatherDataActive?: boolean;
  isVisionApiActive?: boolean;
  sessionCount?: number;
}

export default function InventoryHeader({ 
  isWeatherDataActive = true, 
  isVisionApiActive = false,
  sessionCount = 0
}: InventoryHeaderProps) {
  const { logUserAction } = useLogger('InventoryHeader');

  const handleRoadmapClick = () => {
    logUserAction('navigate_to_roadmap', { currentSessionCount: sessionCount });
  };

  return (
    <header className="notepad-header text-white px-6 py-6 mb-8 rounded-t-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-xl p-3">
              <Package2 className="text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold handwritten-text text-white">
                Booze Counter 9000
              </h1>
              <p className="text-blue-100 handwritten-text">
                AI-Powered Beverage Inventory Management
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <nav className="flex items-center space-x-2">
              <Link href="/roadmap">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 handwritten-text"
                  onClick={handleRoadmapClick}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Project Roadmap
                </Button>
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2">
              {isWeatherDataActive && (
                <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                  <BadgeCheck className="text-green-300" />
                  <span className="text-sm handwritten-text">Live Weather Data</span>
                </div>
              )}
              
              {isVisionApiActive && (
                <Badge variant="outline" className="bg-blue-500/20 border-blue-300 text-blue-100">
                  Vision AI Active
                </Badge>
              )}
              
              <Badge variant="outline" className="bg-amber-500/20 border-amber-300 text-amber-100">
                Session {sessionCount}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}