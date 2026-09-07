import { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { AISourcingResults } from '../types';

export const useAISourcing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sourcingResults, setSourcingResults] = useState<AISourcingResults | null>(null);

  const generateSourcingStrategy = async (jobDescription: string) => {
    setIsLoading(true);
    setError(null);
    setSourcingResults(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) ;
      
      if (!apiKey) {
        setError("Gemini API Key is missing. Please configure VITE_GEMINI_API_KEY in your environment.");
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        As an expert technical recruiter, analyze the following job description and generate a sourcing strategy in JSON format.
        Job Description:
        """
        ${jobDescription}
        """

        The JSON output must follow this structure. Generate 3 distinct and realistic suggested candidate profiles. Ensure the skills and experience are relevant to the job description.
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          booleanSearch: { 
            type: Type.STRING,
            description: "A detailed LinkedIn boolean search string to find suitable candidates. Use operators like AND, OR, NOT, and parentheses. Include keywords for skills, titles, and potential industries."
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 5-8 relevant keywords for searching on job boards."
          },
          suggestedCandidates: {
            type: Type.ARRAY,
            description: "A list of 3 generated candidate profiles.",
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                experienceYears: { type: Type.INTEGER },
                expectedSalary: { type: Type.INTEGER },
                skills: { type: Type.STRING, description: "Comma-separated list of relevant skills." },
                linkedinUrl: { type: Type.STRING },
                summary: { type: Type.STRING, description: "A brief 1-2 sentence summary of the candidate's profile and why they are a good fit." },
              },
              required: ["name", "email", "phone", "experienceYears", "expectedSalary", "skills", "linkedinUrl", "summary"]
            }
          }
        },
        required: ["booleanSearch", "keywords", "suggestedCandidates"]
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
        throw new Error("Model returned empty response");
      }
      const parsedContent: AISourcingResults = JSON.parse(jsonText);
      setSourcingResults(parsedContent);

    } catch (e: any) {
      console.error("Error generating sourcing strategy:", e);
      setError(e?.message || "Failed to generate sourcing strategy. Please check your API key or network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setSourcingResults(null);
  };

  return { isLoading, error, sourcingResults, generateSourcingStrategy, reset };
};
