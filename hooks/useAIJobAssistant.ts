import { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

type GeneratedContent = {
  jobDescription: string;
  competencies: string[];
  interviewQuestions: { type: string; questions: string[] }[];
};

export const useAIJobAssistant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);

  const generateJobDetails = async (title: string, level: string, industry: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) ;
      if (!apiKey) {
        setError("Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your environment.");
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        Based on the following job details, generate a comprehensive job requirement document in JSON format.
        Job Title: ${title}
        Level: ${level}
        Industry/Department: ${industry}

        The JSON output should strictly follow this structure:
        {
          "jobDescription": "A detailed and engaging job description.",
          "competencies": ["A list of 5-7 key skills and competencies (KSAO)."],
          "interviewQuestions": [
            { "type": "Behavioral (STAR method)", "questions": ["A list of 3-4 relevant behavioral questions."] },
            { "type": "Technical/Role-Specific", "questions": ["A list of 3-4 relevant technical or role-specific questions."] }
          ]
        }
      `;
      
      const responseSchema = {
          type: Type.OBJECT,
          properties: {
              jobDescription: { type: Type.STRING },
              competencies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
              },
              interviewQuestions: {
                  type: Type.ARRAY,
                  items: {
                      type: Type.OBJECT,
                      properties: {
                          type: { type: Type.STRING },
                          questions: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING }
                          }
                      },
                      required: ["type", "questions"]
                  }
              }
          },
          required: ["jobDescription", "competencies", "interviewQuestions"]
      };

      const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          }
      });
      
      const jsonText = response.text ? response.text.trim() : '';
      if (!jsonText) {
        throw new Error("Empty response from AI model");
      }
      const parsedContent: GeneratedContent = JSON.parse(jsonText);
      setGeneratedContent(parsedContent);

    } catch (e: any) {
      console.error("Error generating job details:", e);
      setError(e?.message || "Failed to generate content. Please check the console for more details.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setGeneratedContent(null);
  };

  return { isLoading, error, generatedContent, generateJobDetails, reset };
};
