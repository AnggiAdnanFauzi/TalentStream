import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export const useOfferLetterGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerLetterText, setOfferLetterText] = useState<string | null>(null);

  const generateLetter = async (
    candidateName: string,
    jobTitle: string,
    salaryMin: number,
    salaryMax: number
  ) => {
    setIsLoading(true);
    setError(null);
    setOfferLetterText(null);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) ;

      if (!apiKey) {
        setError("API key not found.");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const managerName = "Alex Greene";
      const companyName = "TalentStream";
      // For realism, pick a salary in the upper half of the range.
      const offeredSalary = Math.floor(salaryMin + (salaryMax - salaryMin) * (Math.random() * 0.5 + 0.5));

      const prompt = `
        Generate a formal job offer letter in plain text format. Do not use Markdown.
        The tone should be professional, welcoming, and enthusiastic.

        Use the following details:
        - Company Name: ${companyName}
        - Candidate Name: ${candidateName}
        - Job Title: ${jobTitle}
        - Offered Annual Salary: $${offeredSalary.toLocaleString()}
        - Reports To: ${managerName}, Hiring Manager
        - Start Date: Two weeks from today's date (calculate and insert the actual date).
        - Include standard clauses like at-will employment, confidentiality, and requirement for I-9 verification.
        - The letter should be from ${managerName}.

        Structure the letter with clear headings or paragraphs for:
        1. The official offer.
        2. Position details (title, reporting structure).
        3. Compensation.
        4. Start date.
        5. Any contingencies (e.g., background check).
        6. A closing statement expressing excitement and instructions on how to accept the offer (e.g., by signing and returning).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });
      
      const text = response.text ? response.text.trim() : '';
      if (!text) {
        throw new Error("Empty response from AI offer letter generator");
      }
      setOfferLetterText(text);

    } catch (e: any) {
      console.error("Error generating offer letter:", e);
      setError(e?.message || "Failed to generate the offer letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setOfferLetterText(null);
  };

  return { isLoading, error, offerLetterText, generateLetter, reset };
};
