import React, { useState } from 'react';
import { Check, X, Clock, Sparkles } from 'lucide-react';
import { validateSentence } from '../utils/grammarValidator';
import { ValidationResult, ValidationHistory } from '../types/grammar';
import ParseTree from './ParseTree';

interface LiveValidatorProps {
  onValidation: (history: ValidationHistory) => void;
  recentHistory: ValidationHistory[];
}

const LiveValidator: React.FC<LiveValidatorProps> = ({ onValidation, recentHistory }) => {
  const [sentence, setSentence] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    if (!sentence.trim()) return;
    
    setIsLoading(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const validation = validateSentence(sentence);
      setResult(validation);
      setIsLoading(false);
      
      // Add to history
      const historyEntry: ValidationHistory = {
        id: Date.now().toString(),
        timestamp: new Date(),
        sentence: sentence.trim(),
        result: validation
      };
      
      onValidation(historyEntry);
    }, 800);
  };

  const highlightError = (text: string, errorPosition?: number, errorWord?: string) => {
    if (!errorPosition && !errorWord) return text;
    
    const words = text.split(' ');
    return words.map((word, index) => {
      const isError = index === errorPosition || word.toLowerCase() === errorWord?.toLowerCase();
      return (
        <span
          key={index}
          className={isError ? 'bg-red-500/20 text-red-300 px-1 rounded border-b-2 border-red-500' : ''}
        >
          {word}
        </span>
      );
    }).reduce((acc, curr, index) => (
      index === 0 ? [curr] : [...acc, ' ', curr]
    ), [] as React.ReactNode[]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Live Grammar Validator</h2>
        </div>
        
        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Chatbot Response / Sentence to Validate
          </label>
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Type or paste a sentence here... (e.g., 'the student reads a book')"
            className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleValidate}
          disabled={!sentence.trim() || isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Analyzing Grammar...
            </>
          ) : (
            'Validate Sentence'
          )}
        </button>

        {/* Results Section */}
        {result && (
          <div className="mt-8 p-6 rounded-lg border transition-all duration-300" 
               style={{
                 backgroundColor: result.isValid ? 'rgb(5 46 22)' : 'rgb(69 10 10)',
                 borderColor: result.isValid ? 'rgb(34 197 94)' : 'rgb(239 68 68)'
               }}>
            <div className="flex items-center gap-3 mb-4">
              {result.isValid ? (
                <>
                  <Check className="w-8 h-8 text-green-400" />
                  <span className="text-3xl font-bold text-green-400">VALID ✅</span>
                </>
              ) : (
                <>
                  <X className="w-8 h-8 text-red-400" />
                  <span className="text-3xl font-bold text-red-400">INVALID ❌</span>
                </>
              )}
            </div>

            {result.isValid ? (
              <div className="space-y-4">
                <p className="text-green-200">The sentence follows correct grammatical structure.</p>
                {result.parseTree && <ParseTree parseTree={result.parseTree} />}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                  <p className="text-red-200 font-medium mb-2">Input with highlighted errors:</p>
                  <p className="text-lg">
                    {highlightError(sentence, result.errorPosition, result.errorWord)}
                  </p>
                </div>
                <p className="text-red-200 font-medium">
                  <strong>Error:</strong> {result.error}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Recent History */}
        {recentHistory.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-medium text-white">Recent Validations</h3>
            </div>
            <div className="space-y-2">
              {recentHistory.slice(-5).reverse().map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-700">
                  <span className="text-gray-300 truncate flex-1 mr-4">{item.sentence}</span>
                  <div className="flex items-center gap-2">
                    {item.result.isValid ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-xs text-gray-500">
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveValidator;