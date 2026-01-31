
import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight, DateIdea } from "./types";

export const geminiService = {
  async analyzeCheckIn(modelAcronym: string, notes: Record<number, string>): Promise<AIInsight> {
    // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `Analyze this couple's relationship check-in based on the ${modelAcronym} framework.
    Notes provided: ${JSON.stringify(notes)}
    Provide a warm, supportive analysis including current mood, words of encouragement, and one specific area to focus on for growth this week.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING, description: "The overall emotional tone of the check-in." },
            encouragement: { type: Type.STRING, description: "Warm words to uplift the couple." },
            suggestedFocus: { type: Type.STRING, description: "A gentle suggestion for what to focus on next." }
          },
          required: ["mood", "encouragement", "suggestedFocus"]
        }
      }
    });

    // Access the .text property directly from the response as a string
    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr) as AIInsight;
  },

  async suggestDateIdeas(timeframe: string): Promise<DateIdea[]> {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `Suggest 3 unique and creative date ideas for a couple based on a ${timeframe} timeframe.
    Make them intentional, focusing on connection and fun.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              whyItWorks: { type: Type.STRING, description: "Explain why this helps connection." }
            },
            required: ["title", "description", "whyItWorks"]
          }
        }
      }
    });

    // Access the .text property directly from the response as a string
    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr) as DateIdea[];
  }
};
