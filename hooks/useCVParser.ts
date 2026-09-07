import { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { NewCandidateData } from '../types';

export const useCVParser = () => {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCVText = async (resumeText: string): Promise<Partial<NewCandidateData> | null> => {
    setIsParsing(true);
    setError(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) ;

      if (!apiKey) {
        setError("API key is not configured.");
        return null;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
          Analyze the provided resume/CV text and extract the candidate's information.
          If a piece of information is not found, leave the corresponding field as an empty string.
          Provide the output in a clean JSON format.
          - experienceYears should be a number representing the total years of professional experience. If it's a range, take the higher number. If not found, default to 0.
          - expectedSalary should be left as 0, as it's not typically on a resume.
          - skills should be a comma-separated string of key skills.

          Resume Text:
          """
          ${resumeText}
          """
      `;
      
      const responseSchema = {
          type: Type.OBJECT,
          properties: {
              name: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              experienceYears: { type: Type.INTEGER },
              linkedinUrl: { type: Type.STRING },
              portfolioUrl: { type: Type.STRING },
              skills: { type: Type.STRING, description: "Comma-separated list of skills." },
          },
          required: ["name", "email", "phone", "experienceYears", "linkedinUrl", "portfolioUrl", "skills"]
      };

      const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
              responseMimeType: "application/json",
              responseSchema: responseSchema,
          },
      });
      
      const jsonText = response.text ? response.text.trim() : '';
      if (!jsonText) {
        throw new Error("Empty response from AI parser");
      }
      const parsedData = JSON.parse(jsonText);

      return parsedData as Partial<NewCandidateData>;

    } catch (e: any) {
        console.error("Error parsing CV text:", e);
        setError("Failed to parse resume text. Please check the format or fill out the form manually.");
        return null;
    } finally {
        setIsParsing(false);
    }
  };

  return { isParsing, error, parseCVText };
};
