
import React, { useState, useEffect } from 'react';

interface LinkInputFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

export const LinkInputForm: React.FC<LinkInputFormProps> = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

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
      } catch {
        alert('Please enter a valid URL.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-center">
      <div className="relative flex-grow">
        <svg
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${isValidUrl ? 'text-primary' : 'text-zinc-400'}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
        </svg>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Paste any URL — Amazon, recipe, YouTube, article..."
          className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm font-medium outline-none transition-all ${isValidUrl ? 'border-primary focus:ring-2 focus:ring-primary/20' : 'border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100'} placeholder-zinc-400`}
          disabled={isLoading}
          autoFocus
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !isValidUrl}
        className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold font-['Space_Grotesk'] uppercase tracking-wider transition-all ${isValidUrl && !isLoading ? 'bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg' : 'bg-zinc-300 cursor-not-allowed'}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          'Dump It'
        )}
      </button>
    </form>
  );
};
