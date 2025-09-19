import React, { useState } from 'react';
import { Bot, Play, BarChart3 } from 'lucide-react';
import LiveValidator from './components/LiveValidator';
import GrammarPlayground from './components/GrammarPlayground';
import QualityDashboard from './components/QualityDashboard';
import { useValidationHistory } from './hooks/useValidationHistory';

type TabType = 'validator' | 'playground' | 'dashboard';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('validator');
  const { history, addValidation, stats } = useValidationHistory();

  const tabs = [
    { id: 'validator', label: 'Live Validator', icon: Bot, color: 'text-blue-400' },
    { id: 'playground', label: 'Grammar Playground', icon: Play, color: 'text-green-400' },
    { id: 'dashboard', label: 'Quality Dashboard', icon: BarChart3, color: 'text-purple-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Bot className="w-8 h-8 text-blue-400" />
              <h1 className="text-xl font-bold text-white">
                Automata-Based Grammar Validator
              </h1>
              <span className="text-sm text-gray-400 hidden sm:inline">
                for LLM Chatbots
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? `border-current ${tab.color} ${tab.color}`
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {activeTab === 'validator' && (
          <LiveValidator
            onValidation={addValidation}
            recentHistory={history}
          />
        )}
        {activeTab === 'playground' && <GrammarPlayground />}
        {activeTab === 'dashboard' && (
          <QualityDashboard
            history={history}
            stats={stats}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-sm text-gray-400 text-center">
            Powered by Context-Free Grammars and NLTK ChartParser principles
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;