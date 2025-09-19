export interface ParseRule {
  left: string;
  right: string[];
}

export interface ValidationResult {
  isValid: boolean;
  parseTree?: ParseNode;
  error?: string;
  errorPosition?: number;
  errorWord?: string;
}

export interface ParseNode {
  label: string;
  children: ParseNode[];
  word?: string;
}

export interface ValidationHistory {
  id: string;
  timestamp: Date;
  sentence: string;
  result: ValidationResult;
}

export interface GrammarStats {
  totalValidations: number;
  validCount: number;
  invalidCount: number;
  validPercentage: number;
  invalidPercentage: number;
  commonErrors: { [key: string]: number };
}