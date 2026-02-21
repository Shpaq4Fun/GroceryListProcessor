import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { extractTextFromImage } from '../services/geminiService';

interface InputSectionProps {
  onProcess: (text: string) => void;
  isLoading: boolean;
}

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        if (typeof reader.result === 'string') {
          const base64Data = reader.result.split(',')[1];
          resolve(base64Data);
        } else {
          reject(new Error('Failed to read file as string'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

export const InputSection: React.FC<InputSectionProps> = ({ onProcess, isLoading }) => {
  const [text, setText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (text.trim()) {
      onProcess(text);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const base64Data = await readFileAsBase64(file);
      const extractedText = await extractTextFromImage(base64Data, file.type);
      setText((prev) => (prev ? `${prev}\n${extractedText}` : extractedText));
    } catch (error) {
      console.error("Failed to extract text", error);
      alert("Failed to read the image. Please try again.");
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-xl font-bold text-emerald-400">New List</h2>
            <p className="text-neutral-400 text-sm">
              Paste your list or upload a photo of a handwritten one.
            </p>
          </div>
          <button
            onClick={triggerFileInput}
            disabled={isExtracting || isLoading}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed border border-neutral-700 rounded-md text-sm font-medium text-neutral-200 transition-colors"
          >
            {isExtracting ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <Camera className="w-4 h-4 text-emerald-400" />
            )}
            {isExtracting ? "Reading..." : "Scan Photo"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <textarea
          className="w-full h-64 bg-neutral-800 text-neutral-200 p-4 rounded-md border border-neutral-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none resize-none placeholder-neutral-600 text-base"
          placeholder="e.g. Need milk, 2 cartons of eggs, bread (whole wheat only!), maybe some beer? Also get cat food..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || !text.trim()}
        className={`
          w-full py-4 rounded-lg font-bold text-lg tracking-wide shadow-md transition-all
          ${isLoading 
            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98]'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="animate-spin h-5 w-5 text-neutral-400" />
            Processing...
          </span>
        ) : (
          "Organize My List"
        )}
      </button>
    </div>
  );
};
