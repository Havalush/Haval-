
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { SuggestionCard } from './components/SuggestionCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { getDeclutterSuggestions } from './services/geminiService';
import type { Suggestion } from './types';
import { LogoIcon, SparklesIcon, BackIcon } from './components/icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setError(null);
    setSuggestions([]);
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove data:mime/type;base64, prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyzeClick = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const base64Image = await fileToBase64(imageFile);
      const generatedSuggestions = await getDeclutterSuggestions(base64Image, imageFile.type);
      setSuggestions(generatedSuggestions);
    } catch (err) {
      console.error(err);
      setError('Sorry, something went wrong while analyzing your image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
  };
  
  const Header = () => (
    <header className="w-full p-4 flex items-center justify-center border-b border-slate-200 bg-white/60 backdrop-blur-lg sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-800">Room Revamp AI</h1>
        </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <Header />
      <main className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        {!imageUrl && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Organize Your Space, Magically</h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">Upload a photo of your room and let our AI provide smart, actionable decluttering suggestions.</p>
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        )}

        {imageUrl && (
          <div className="flex flex-col gap-8">
            <div className="relative group w-full max-w-2xl mx-auto rounded-xl shadow-lg overflow-hidden">
                <img src={imageUrl} alt="Room to be analyzed" className="w-full h-auto object-contain" />
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-full font-semibold text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
                disabled={isLoading}
              >
                <BackIcon className="w-5 h-5" />
                New Photo
              </button>
              <button
                onClick={handleAnalyzeClick}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-md disabled:bg-indigo-400 disabled:cursor-not-allowed"
                disabled={isLoading || suggestions.length > 0}
              >
                <SparklesIcon className="w-5 h-5" />
                Get Suggestions
              </button>
            </div>
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {error && <p className="text-center text-red-500 font-medium mt-8 bg-red-100 p-4 rounded-lg">{error}</p>}
        
        {suggestions.length > 0 && !isLoading && (
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-center mb-6">Your Personalized Plan ✨</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestions.map((suggestion, index) => (
                        <SuggestionCard key={index} suggestion={suggestion} index={index} />
                    ))}
                </div>
            </div>
        )}
      </main>
      <footer className="text-center p-4 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Room Revamp AI. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
