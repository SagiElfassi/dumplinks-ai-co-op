
import React, { useState, useEffect } from 'react';

interface LinkInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  isEmpty?: boolean; // Kept in interface for compatibility, though unused now
}

const PLACEHOLDERS = [
  "Paste or type any link…",
  "Amazon find? Recipe? TikTok? Drop it here",
  "That jacket you just saw → dump it before you forget",
  "YouTube tutorial you’ll actually watch later → here"
];

export const LinkInputForm: React.FC<LinkInputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isPlaceholderFading, setIsPlaceholderFading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaceholderFading(true);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setIsPlaceholderFading(false);
      }, 300); // Match transition duration
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      try {
          new URL(url);
          setIsValidUrl(true);
      } catch {
          setIsValidUrl(false);
      }
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !isLoading) {
      try {
        new URL(url);
        onSubmit(url);
        setUrl('');
      } catch (_) {
        alert('Please enter a valid URL.');
      }
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative group">
        {/* Glowing Background Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r from-primary-500 via-accent-purple to-primary-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-lg ${isValidUrl ? 'opacity-70 scale-105' : ''}`}></div>
        
        <div className={`relative flex items-center bg-gray-900/90 backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden p-1 ${isValidUrl ? 'border-primary-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-white/10 shadow-2xl'}`}>
            <div className="flex-grow relative h-12 md:h-14 flex items-center">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 transition-colors duration-300 ${isValidUrl ? 'text-primary-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}

                    className="block w-full pl-12 pr-4 bg-transparent border-none text-white text-lg focus:ring-0 focus:outline-none font-medium h-full"
                    disabled={isLoading}
                />
                {/* Rotating Placeholder */}
                {!url && (
                    <div className={`absolute left-12 right-4 pointer-events-none text-gray-500 text-lg font-medium truncate transition-opacity duration-300 ${isPlaceholderFading ? 'opacity-0' : 'opacity-100'}`}>
                        {PLACEHOLDERS[placeholderIndex]}
                    </div>
                )}
            </div>
            
            <button
                type="submit"
                disabled={isLoading}
                className={`flex-shrink-0 px-6 h-12 md:h-14 flex items-center justify-center rounded-xl text-white text-base font-bold shadow-lg transform transition-all duration-200 bg-gradient-to-r from-primary-600 to-pink-600 ${isValidUrl ? 'scale-105 hover:scale-110 animate-pulse-subtle opacity-100' : 'opacity-50 cursor-not-allowed'}`}
            >
                {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ) : (
                'Dump It'
                )}
            </button>
        </div>
        </form>
    </div>
  );
};
