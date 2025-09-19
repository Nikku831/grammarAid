import { useState, useEffect } from 'react';
import { ValidationHistory, GrammarStats } from '../types/grammar';

export const useValidationHistory = () => {
  const [history, setHistory] = useState<ValidationHistory[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('grammar-validation-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const restoredHistory = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(restoredHistory);
      } catch (error) {
        console.error('Failed to load validation history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('grammar-validation-history', JSON.stringify(history));
  }, [history]);

  const addValidation = (validation: ValidationHistory) => {
    setHistory(prev => [...prev, validation]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getStats = (): GrammarStats => {
    const totalValidations = history.length;
    const validCount = history.filter(item => item.result.isValid).length;
    const invalidCount = totalValidations - validCount;
    
    const validPercentage = totalValidations > 0 ? (validCount / totalValidations) * 100 : 0;
    const invalidPercentage = totalValidations > 0 ? (invalidCount / totalValidations) * 100 : 0;
    
    // Count common errors
    const commonErrors: { [key: string]: number } = {};
    history.forEach(item => {
      if (!item.result.isValid && item.result.error) {
        commonErrors[item.result.error] = (commonErrors[item.result.error] || 0) + 1;
      }
    });

    return {
      totalValidations,
      validCount,
      invalidCount,
      validPercentage,
      invalidPercentage,
      commonErrors
    };
  };

  return {
    history,
    addValidation,
    clearHistory,
    stats: getStats()
  };
};