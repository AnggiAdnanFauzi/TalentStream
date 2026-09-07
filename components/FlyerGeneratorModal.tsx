import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { GoogleGenAI } from "@google/genai";
import { Job } from '../types';
import { XMarkIcon } from './icons/Icons';

interface FlyerGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}

const FlyerGeneratorModal: React.FC<FlyerGeneratorModalProps> = ({ isOpen, onClose, job }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [brandColor, setBrandColor] = useState('#2563eb'); // primary-600
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    // Reset state on modal close/open
    if (!isOpen) {
        setSummary(null);
        setError(null);
        setIsLoading(false);
    }
    if (isOpen && job?.jobDescription && !summary && !error && !isLoading) {
      const generateSummary = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && (process.env?.API_KEY || process.env?.GEMINI_API_KEY)) ;
            if (!apiKey) {
              setError("API Key is missing.");
              setIsLoading(false);
              return;
            }
            const ai = new GoogleGenAI({ apiKey });
            const prompt = `Summarize the following job description into 3-4 concise and compelling bullet points for a hiring flyer. Each bullet point must start with an action verb. Output ONLY the bullet points, each on a new line. Do not include any introductory text, titles, or markdown formatting like '-' or '*'. Example:
Design and build scalable web applications.
Collaborate with cross-functional teams.
Optimize applications for maximum speed and scalability.

Job Description:
"""
${job.jobDescription}
"""
`;
            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: prompt,
            });
            const text = response.text ? response.text.trim() : '';
            setSummary(text);
        } catch (e: any) {
            console.error("Error generating summary:", e);
            setError(e?.message || "Failed to generate summary. Please try again.");
        } finally {
            setIsLoading(false);
        }
      };
      generateSummary();
    }
  }, [isOpen, job, summary, error, isLoading]);

  useEffect(() => {
    if (isOpen && job) {
      const applicationUrl = `https://talentstream.example.com/apply/${job.id}`;
      QRCode.toDataURL(applicationUrl, { width: 300, margin: 2, errorCorrectionLevel: 'H' })
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error("QR Code generation failed:", err));
    }
  }, [isOpen, job]);
  
  const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for(let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  useEffect(() => {
    if (isOpen && job && canvasRef.current && summary && qrCodeUrl) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Header band
      ctx.fillStyle = brandColor;
      ctx.fillRect(0, 0, width, 180);

      // Header text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText("WE'RE HIRING", width / 2, 80);

      // Company logo placeholder
      ctx.font = 'bold 28px Inter, sans-serif';
      ctx.fillText("TalentStream", width / 2, 130);
      
      // Job Title
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 52px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(job.title, width / 2, 260, width - 100);

      // Job Location/Dept
      ctx.fillStyle = '#64748b';
      ctx.font = '24px Inter, sans-serif';
      ctx.fillText(`${job.department} • ${job.location}`, width / 2, 300);

      // Summary Points
      ctx.textAlign = 'left';
      ctx.fillStyle = '#334155';
      ctx.font = '26px Inter, sans-serif';
      
      const bulletPoints = summary.split('\n').map(line => `• ${line.trim()}`);
      let yPos = 380;
      const maxWidth = width - 200;
      const lineHeight = 45;

      bulletPoints.forEach(point => {
        yPos = wrapText(ctx, point, 100, yPos, maxWidth, lineHeight);
      });

      // QR Code and CTA
      const qrImage = new Image();
      qrImage.src = qrCodeUrl;
      qrImage.onload = () => {
          const qrSize = 150;
          ctx.drawImage(qrImage, (width / 2) - (qrSize / 2), height - 320, qrSize, qrSize);
          
          ctx.fillStyle = brandColor;
          ctx.font = 'bold 32px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText("Scan to Apply!", width / 2, height - 140);
      
          ctx.fillStyle = '#475569';
          ctx.font = '18px Inter, sans-serif';
          ctx.fillText(`talentstream.example.com/apply/${job.id}`, width / 2, height - 100);
          
          ctx.fillStyle = '#94a3b8';
          ctx.font = '14px Inter, sans-serif';
          ctx.fillText(`Posting ID: ${job.id}`, width / 2, height - 40);
      };
    }
  }, [isOpen, job, brandColor, summary, qrCodeUrl]);
  
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !job) return;
    const link = document.createElement('a');
    link.download = `hiring-flyer-${job.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl transform rounded-lg bg-white dark:bg-slate-800 text-left shadow-xl transition-all m-4">
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700 rounded-t">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white" id="modal-title">
            Flyer Generator for {job?.title}
          </h3>
          <button type="button" onClick={onClose} className="p-1 ml-auto bg-transparent rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-600 dark:hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Customize Flyer</h4>
            <div>
              <label htmlFor="brandColor" className="block mb-2 text-sm font-medium text-slate-900 dark:text-white">
                Brand Color
              </label>
              <div className="relative">
                <input
                  type="color"
                  id="brandColor"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="p-1 h-10 w-full block bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 cursor-pointer rounded-lg"
                />
              </div>
            </div>
            <button
              onClick={handleDownload}
              disabled={isLoading || !!error || !summary}
              className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Download PNG
            </button>
          </div>

          <div className="md:col-span-2 bg-slate-100 dark:bg-slate-900 p-4 rounded-lg flex items-center justify-center min-h-[500px]">
            {isLoading && <div className="text-slate-500">Generating AI summary...</div>}
            {error && <div className="text-red-500 p-4 text-center">{error}</div>}
            {(!isLoading && !error && summary) && (
              <canvas
                ref={canvasRef}
                width={800}
                height={1200}
                className="w-full h-auto object-contain shadow-lg"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyerGeneratorModal;
