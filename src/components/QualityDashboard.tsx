import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ValidationHistory, GrammarStats } from '../types/grammar';

interface QualityDashboardProps {
  history: ValidationHistory[];
  stats: GrammarStats;
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({ history, stats }) => {
  const getTopErrors = () => {
    const errors: { [key: string]: number } = {};
    history.forEach(item => {
      if (!item.result.isValid && item.result.error) {
        errors[item.result.error] = (errors[item.result.error] || 0) + 1;
      }
    });
    
    return Object.entries(errors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const topErrors = getTopErrors();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <h2 className="text-3xl font-bold text-white">LLM Grammar Quality Report</h2>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-300">Total Validations</h3>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalValidations}</p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-300">Valid Sentences</h3>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-green-400">
              {stats.validPercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.validCount} / {stats.totalValidations}
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-300">Invalid Sentences</h3>
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-red-400">
              {stats.invalidPercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {stats.invalidCount} / {stats.totalValidations}
            </p>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Quality Overview</h3>
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgb(239 68 68)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${stats.invalidPercentage * 2.51} 251`}
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgb(34 197 94)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${stats.validPercentage * 2.51} 251`}
                  strokeDashoffset={`-${stats.invalidPercentage * 2.51}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {stats.validPercentage.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-gray-400">Valid</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span className="text-gray-400">Invalid</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Validations Table */}
          <div className="xl:col-span-2 bg-gray-900 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-400" />
              <h3 className="text-xl font-bold text-white">Recent Validations</h3>
            </div>
            
            {history.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Timestamp</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Sentence</th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-gray-400">Result</th>
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(-15).reverse().map((item) => (
                      <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="py-3 px-2 text-sm text-gray-400">
                          {item.timestamp.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-sm text-white max-w-xs truncate">
                          {item.sentence}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {item.result.isValid ? (
                            <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-400 max-w-xs truncate">
                          {item.result.isValid ? 'Valid structure' : item.result.error}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No validations yet</p>
                <p className="text-sm text-gray-500">Start validating sentences to see data here</p>
              </div>
            )}
          </div>

          {/* Top Grammatical Errors */}
          <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h3 className="text-xl font-bold text-white">Top Grammatical Errors</h3>
            </div>
            
            {topErrors.length > 0 ? (
              <div className="space-y-4">
                {topErrors.map(([error, count], index) => (
                  <div key={error} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 flex-1 mr-2 leading-tight">
                        {error}
                      </span>
                      <span className="text-sm font-bold text-red-400">
                        {count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max((count / Math.max(...topErrors.map(([,c]) => c))) * 100, 10)}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-gray-400">No errors recorded yet</p>
                <p className="text-sm text-gray-500">Validate some sentences to see common error patterns</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityDashboard;