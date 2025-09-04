
import { GoogleGenAI, Type } from "@google/genai";
import type { Emotion, PersonalInfoItem, UploadedFile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "YOUR_API_KEY_HERE" });

const emotionAnalysisModel = 'gemini-2.5-flash';
const chatModel = 'gemini-2.5-flash';

const emotionSchema = {
  type: Type.OBJECT,
  properties: {
    emotion: {
      type: Type.STRING,
      description: "A single word for the dominant emotion (e.g., Joy, Sadness, Anger, Surprise, Fear, Neutral).",
    },
    emoji: {
      type: Type.STRING,
      description: "A single emoji that best represents the emotion.",
    },
  },
  required: ["emotion", "emoji"],
};

export const analyzeEmotion = async (text: string): Promise<Emotion> => {
  try {
    const response = await ai.models.generateContent({
      model: emotionAnalysisModel,
      contents: `Analyze the emotion of the following text. Text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: emotionSchema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    return { label: result.emotion, emoji: result.emoji };
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    return { label: "Neutral", emoji: "😐" };
  }
};

export const getChatResponse = async (
    message: string, 
    history: { role: string, parts: { text: string }[] }[],
    personalInfo?: Record<string, string>,
    files?: UploadedFile[]
): Promise<string> => {
    try {
        let systemInstructionParts: string[] = ["You are a helpful AI assistant."];

        if (personalInfo && Object.keys(personalInfo).length > 0) {
            const infoString = Object.entries(personalInfo)
                .map(([key, value]) => `- ${key}: ${value}`)
                .join('\n');
            systemInstructionParts.push(`Here is some personal information about the user you are talking to. Use it to personalize your responses when relevant:\n${infoString}`);
        }

        if (files && files.length > 0) {
            const fileContext = files.map(file => 
                `--- Document: ${file.name} ---\n${file.content}\n--------------------------`
            ).join('\n\n');
            systemInstructionParts.push(`Additionally, the user has provided the following documents for context. Use information from them to answer questions when relevant:\n\n${fileContext}`);
        }
        
        const systemInstruction = systemInstructionParts.length > 1 ? systemInstructionParts.join('\n\n') : undefined;

        const chat = ai.chats.create({
            model: chatModel,
            history: history,
            config: {
                ...(systemInstruction && { systemInstruction }),
            },
        });

        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error getting chat response:", error);
        return "Sorry, I encountered an error. Please try again.";
    }
};
