
import { GoogleGenAI, Type } from "@google/genai";
import type { Suggestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const declutterPrompt = `
You are an expert home organizer and decluttering consultant named 'Revamp'. 
Analyze the provided image of a room. Identify specific areas or items that are cluttered or could be better organized. 
For each area, provide a concrete, actionable suggestion for how to improve it.
Focus on practical advice that the user can implement easily.
Respond ONLY with a JSON array of objects. Do not include any other text, greetings, or explanations.
`;

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      area: {
        type: Type.STRING,
        description: "The specific area or item in the room that needs attention (e.g., 'Coffee Table', 'Bookshelf', 'Desk Corner')."
      },
      suggestionText: {
        type: Type.STRING,
        description: "A clear, actionable decluttering or organization suggestion for this area."
      }
    },
    required: ["area", "suggestionText"],
    propertyOrdering: ["area", "suggestionText"],
  }
};


export const getDeclutterSuggestions = async (
  imageBase64: string,
  mimeType: string
): Promise<Suggestion[]> => {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: declutterPrompt,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text.trim();
    const suggestions = JSON.parse(jsonText) as Suggestion[];
    
    if(!Array.isArray(suggestions)){
      throw new Error("API did not return a valid array of suggestions.");
    }

    return suggestions;
  } catch (error) {
    console.error("Error fetching decluttering suggestions:", error);
    throw new Error("Failed to get suggestions from Gemini API.");
  }
};
