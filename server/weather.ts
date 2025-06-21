interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  forecast: {
    date: string;
    temp_high: number;
    temp_low: number;
    condition: string;
  }[];
}

interface DemandForecast {
  productCategory: string;
  demandMultiplier: number;
  reasoning: string;
  recommendedAction: string;
}

export async function getWeatherData(location: string = "New York"): Promise<WeatherData> {
  // Using OpenWeatherMap API (free tier: 1000 calls/month)
  const apiKey = process.env.WEATHER_API_KEY;
  
  if (!apiKey) {
    throw new Error("Weather API key not configured");
  }

  try {
    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`
    );
    
    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }
    
    const currentData = await currentResponse.json();
    
    // 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=imperial`
    );
    
    const forecastData = await forecastResponse.json();
    
    // Process forecast (daily highs)
    const dailyForecast = forecastData.list
      .filter((_: any, index: number) => index % 8 === 0) // Every 8th item = daily
      .slice(0, 5)
      .map((item: any) => ({
        date: new Date(item.dt * 1000).toLocaleDateString(),
        temp_high: Math.round(item.main.temp_max),
        temp_low: Math.round(item.main.temp_min),
        condition: item.weather[0].main
      }));

    return {
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      humidity: currentData.main.humidity,
      forecast: dailyForecast
    };
    
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
}

export function calculateDemandForecast(weatherData: WeatherData): DemandForecast[] {
  const forecasts: DemandForecast[] = [];
  const temp = weatherData.temperature;
  const condition = weatherData.condition;
  
  // Beer demand logic
  if (temp >= 75) {
    forecasts.push({
      productCategory: "Beer",
      demandMultiplier: temp >= 85 ? 1.4 : 1.25,
      reasoning: `High temperature (${temp}°F) increases beer consumption significantly`,
      recommendedAction: "Increase beer orders by 25-40%. Focus on light beers and lagers."
    });
  } else if (temp <= 50) {
    forecasts.push({
      productCategory: "Beer", 
      demandMultiplier: 0.8,
      reasoning: `Cold weather (${temp}°F) reduces beer consumption`,
      recommendedAction: "Reduce beer orders by 20%. Focus on darker, heavier beers."
    });
  }
  
  // Wine demand logic
  if (temp <= 60 || condition === "Rain") {
    forecasts.push({
      productCategory: "Wine",
      demandMultiplier: 1.2,
      reasoning: `Cool weather/rain (${temp}°F, ${condition}) increases wine consumption`,
      recommendedAction: "Increase wine orders by 20%. Focus on reds and full-bodied wines."
    });
  }
  
  // Spirits demand logic  
  if (temp <= 45) {
    forecasts.push({
      productCategory: "Spirits",
      demandMultiplier: 1.3,
      reasoning: `Cold weather (${temp}°F) increases cocktail and spirits consumption`,
      recommendedAction: "Increase spirits orders by 30%. Focus on whiskey, rum, and hot cocktail ingredients."
    });
  }
  
  // Rainy day logic
  if (condition === "Rain" || condition === "Thunderstorm") {
    forecasts.push({
      productCategory: "All Categories",
      demandMultiplier: 1.15,
      reasoning: "Rainy weather increases overall alcohol consumption as customers stay longer",
      recommendedAction: "Increase all inventory by 15%. Prepare for longer customer visits."
    });
  }
  
  return forecasts;
}

export function generateWeatherBasedReorders(forecasts: DemandForecast[], currentInventory: any[]): any[] {
  const reorderSuggestions = [];
  
  for (const forecast of forecasts) {
    const categoryProducts = currentInventory.filter(product => {
      if (forecast.productCategory === "All Categories") return true;
      
      // Map category names to your database categories
      const categoryMap: { [key: string]: number } = {
        "Beer": 1,
        "Wine": 2, 
        "Spirits": 3
      };
      
      return product.categoryId === categoryMap[forecast.productCategory];
    });
    
    for (const product of categoryProducts) {
      const currentStock = product.lastCountQuantity || 0;
      const parLevel = product.parLevel || 0;
      const adjustedParLevel = Math.round(parLevel * forecast.demandMultiplier);
      
      if (currentStock < adjustedParLevel) {
        reorderSuggestions.push({
          productId: product.id,
          productName: product.name,
          currentStock,
          normalParLevel: parLevel,
          weatherAdjustedParLevel: adjustedParLevel,
          suggestedOrderQuantity: adjustedParLevel - currentStock,
          reasoning: forecast.reasoning,
          priority: forecast.demandMultiplier > 1.3 ? "High" : "Medium"
        });
      }
    }
  }
  
  return reorderSuggestions.sort((a, b) => b.suggestedOrderQuantity - a.suggestedOrderQuantity);
}