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
    
    // Clean up the response if it contains markdown code blocks
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze carbon data");
  }
};
