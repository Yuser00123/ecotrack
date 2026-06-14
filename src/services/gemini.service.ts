import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiModel = (modelName = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const analyzeCarbonData = async (userData: any) => {
  const model = getGeminiModel("gemini-1.5-pro");
  
  const prompt = `
    As an Expert Sustainability Coach, analyze the following user carbon footprint data and provide personalized, actionable insights.
    
    User Data:
    ${JSON.stringify(userData, null, 2)}
    
    Please provide:
    1. A summary of their impact.
    2. 3-5 specific recommendations to reduce their footprint.
    3. A motivational message.
    4. A suggested weekly challenge.
    
    Format the response as a JSON object with the following structure:
    {
      "summary": "string",
      "recommendations": ["string"],
      "motivation": "string",
      "weeklyChallenge": {
        "title": "string",
        "description": "string",
        "estimatedSavings": "string"
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini Pro Error, trying Flash fallback:", error);
    
    // Fallback to Flash if Pro fails
    try {
      const flashModel = getGeminiModel("gemini-1.5-flash");
      const result = await flashModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return JSON.parse(text);
    } catch (fallbackError: any) {
      console.error("Gemini Fallback Error:", fallbackError);
      
      // Extract specific error message if available
      let errorMessage = "Failed to analyze carbon data";
      if (fallbackError.message) {
        if (fallbackError.message.includes("API_KEY_INVALID")) {
          errorMessage = "Your Gemini API Key is invalid. Please check your .env.local file.";
        } else if (fallbackError.message.includes("quota")) {
          errorMessage = "Gemini API quota exceeded. Please try again later.";
        } else if (fallbackError.message.includes("location")) {
          errorMessage = "The Gemini API is not available in your current region.";
        } else {
          errorMessage = fallbackError.message;
        }
      }
      
      throw new Error(errorMessage);
    }
  }
};
