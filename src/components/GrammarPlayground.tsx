import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import { validateSentence } from '../utils/grammarValidator';
import { ValidationResult } from '../types/grammar';
import ParseTree from './ParseTree';
import GrammarRules from './GrammarRules';

const GrammarPlayground: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Real-time validation with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) {
        setIsValidating(true);
        // Simulate processing delay
        setTimeout(() => {
          const validation = validateSentence(input);
          setResult(validation);
          setIsValidating(false);
        }, 200);
      } else {
        setResult(null);
        setIsValidating(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  const getBorderColor = () => {
    if (isValidating) return 'border-yellow-500';
    if (!result) return 'border-gray-600';
    return result.isValid ? 'border-green-500' : 'border-red-500';
  };

  const getIndicatorColor = () => {
    if (isValidating) return 'text-yellow-500';
    if (!result) return 'text-gray-500';
    return result.isValid ? 'text-green-500' : 'text-red-500';
  };

  const highlightErrors = (text: string): React.ReactNode => {
    if (!result || result.isValid) return text;
    
    const words = text.split(' ');
    return words.map((word, index) => {
      const isError = index === result.errorPosition || 
                     word.toLowerCase() === result.errorWord?.toLowerCase();
      return (
        <span
          key={index}
          className={isError ? 'bg-red-500/20 text-red-300 rounded px-1' : 'text-white'}
        >
          {word}
        </span>
      );
    }).reduce((acc, curr, index) => (
      index === 0 ? [curr] : [...acc, ' ', curr]
    ), [] as React.ReactNode[]);
  };

  const examples = [
    'the student reads a book',
    'a teacher writes',
    'the dog chases the cat',
    'a chatbot talks',
    'the student teaches the teacher'
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Playground Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Play className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Grammar Playground</h2>
            </div>

            {/* Interactive Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Type a sentence to test in real-time
              </label>
              <div className="relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Start typing... (e.g., 'the student reads a book')"
                  className={`w-full h-32 bg-gray-900 border-2 ${getBorderColor()} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all resize-none`}
                />
                <div className="absolute top-3 right-3">
                  {isValidating ? (
                    <div className="w-5 h-5 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                  ) : result ? (
                    result.isValid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )
                  ) : null}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
                <span className={`text-sm ${getIndicatorColor()}`}>
                  {isValidating ? 'Checking grammar...' : 
                   !result ? 'Start typing to see real-time feedback' :
                   result.isValid ? 'Grammatically correct' : 'Grammatical error detected'}
                </span>
              </div>
            </div>

            {/* Example Sentences */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Try these example sentences:</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(example)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm rounded-full transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Results */}
            {result && input.trim() && (
              <div className="p-6 rounded-lg border transition-all duration-300"
                   style={{
                     backgroundColor: result.isValid ? 'rgb(5 46 22)' : 'rgb(69 10 10)',
                     borderColor: result.isValid ? 'rgb(34 197 94)' : 'rgb(239 68 68)'
                   }}>
                <div className="flex items-center gap-3 mb-4">
                  {result.isValid ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <span className="text-xl font-bold text-green-400">Grammatically Correct ✅</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-400" />
                      <span className="text-xl font-bold text-red-400">Grammatical Error ❌</span>
                    </>
                  )}
                </div>

                {result.isValid ? (
                  <div className="space-y-4">
                    <p className="text-green-200">Perfect! This sentence follows the defined grammar rules.</p>
                    {result.parseTree && <ParseTree parseTree={result.parseTree} />}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
                      <p className="text-red-200 font-medium mb-2">Sentence with errors highlighted:</p>
                      <p className="text-lg font-mono">
                        {highlightErrors(input)}
                      </p>
                    </div>
                    <p className="text-red-200">
                      <strong>Error:</strong> {result.error}
                    </p>
                    <p className="text-red-300/80 text-sm">
                      Check the grammar rules to understand the required sentence structure.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Grammar Rules Sidebar */}
        <div className="space-y-6">
          <GrammarRules />
          
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Reference</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400">Valid sentence structure:</p>
                <p className="text-blue-300 font-mono">Determiner + Noun + Verb [+ Determiner + Noun]</p>
              </div>
              <div>
                <p className="text-gray-400">Example:</p>
                <p className="text-green-300">"the student reads a book"</p>
              </div>
              <div>
                <p className="text-gray-400">Supported words:</p>
                <div className="text-gray-300">
                  <p><strong>Determiners:</strong> the, a</p>
                  <p><strong>Nouns:</strong> student, teacher, book, apple, chatbot, dog, cat</p>
                  <p><strong>Verbs:</strong> reads, writes, teaches, eats, talks, chases, likes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarPlayground;