import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const savedKey = localStorage.getItem('gemini_api_key');
  const apiKey = savedKey || process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

export const generateResponse = async (prompt: string, modelName: string = 'gemini-3-flash-preview'): Promise<string> => {
  const ai = getClient();
  const apiKey = localStorage.getItem('gemini_api_key') || process.env.API_KEY;

  if (!apiKey) {
    return "Error: API Key is missing. Please configure it in Settings.";
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error processing your request. Please check your API Key configuration.";
  }
};
