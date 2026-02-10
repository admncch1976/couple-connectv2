
import { GoogleGenAI, Type } from "@google/genai";
import { AIInsight, DateIdea } from "./types";

export const geminiService = {
  async analyzeCheckIn(modelAcronym: string, notes: Record<number, string>): Promise<AIInsight> {
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

    const jsonStr = response.text || '{}';
    return JSON.parse(jsonStr) as AIInsight;
  },

  async generatePracticalPrompt(modelAcronym: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Suggest one very simple, unique, and actionable 5-minute task for a couple to do together right now to improve connection, inspired by the theme of ${modelAcronym}. Return only the task text.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text || "Share one thing you are grateful for right now.";
  },

  async suggestDateIdeas(timeframe: string): Promise<DateIdea[]> {
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

    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr) as DateIdea[];
  }
};
