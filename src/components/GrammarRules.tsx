import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Book } from 'lucide-react';
import { formatGrammarRules } from '../utils/grammarValidator';

interface GrammarRulesProps {
  className?: string;
}

const GrammarRules: React.FC<GrammarRulesProps> = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rules = formatGrammarRules();

  return (
    <div className={`bg-gray-800 rounded-lg border border-gray-700 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-750 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Book className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-white">Context-Free Grammar Rules</span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-700 mt-2 pt-4">
          <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
            <pre className="text-gray-300 whitespace-pre-wrap">
              {rules}
            </pre>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            These rules define the grammatical structure that sentences must follow to be considered valid.
          </p>
        </div>
      )}
    </div>
  );
};

export default GrammarRules;