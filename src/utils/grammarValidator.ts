import { ParseRule, ValidationResult, ParseNode } from '../types/grammar';

// Grammar rules based on the Python NLTK CFG
const GRAMMAR_RULES: ParseRule[] = [
  { left: 'S', right: ['NP', 'VP'] },
  { left: 'NP', right: ['Det', 'N'] },
  { left: 'VP', right: ['V', 'NP'] },
  { left: 'VP', right: ['V'] },
  { left: 'Det', right: ['the'] },
  { left: 'Det', right: ['a'] },
  { left: 'N', right: ['student'] },
  { left: 'N', right: ['teacher'] },
  { left: 'N', right: ['book'] },
  { left: 'N', right: ['apple'] },
  { left: 'N', right: ['chatbot'] },
  { left: 'N', right: ['dog'] },
  { left: 'N', right: ['cat'] },
  { left: 'V', right: ['reads'] },
  { left: 'V', right: ['writes'] },
  { left: 'V', right: ['teaches'] },
  { left: 'V', right: ['eats'] },
  { left: 'V', right: ['talks'] },
  { left: 'V', right: ['chases'] },
  { left: 'V', right: ['likes'] },
];

// Get terminal symbols
const getTerminals = (): Set<string> => {
  const terminals = new Set<string>();
  GRAMMAR_RULES.forEach(rule => {
    if (rule.right.length === 1 && rule.right[0].toLowerCase() === rule.right[0]) {
      terminals.add(rule.right[0]);
    }
  });
  return terminals;
};

// Get non-terminals
const getNonTerminals = (): Set<string> => {
  const nonTerminals = new Set<string>();
  GRAMMAR_RULES.forEach(rule => {
    nonTerminals.add(rule.left);
    rule.right.forEach(symbol => {
      if (symbol.toUpperCase() === symbol && symbol.length <= 3) {
        nonTerminals.add(symbol);
      }
    });
  });
  return nonTerminals;
};

// CYK Parser implementation
class CYKParser {
  private rules: Map<string, string[][]>;
  private terminals: Set<string>;
  private nonTerminals: Set<string>;

  constructor() {
    this.rules = new Map();
    this.terminals = getTerminals();
    this.nonTerminals = getNonTerminals();
    
    // Organize rules by left-hand side
    GRAMMAR_RULES.forEach(rule => {
      if (!this.rules.has(rule.left)) {
        this.rules.set(rule.left, []);
      }
      this.rules.get(rule.left)!.push(rule.right);
    });
  }

  parse(tokens: string[]): ValidationResult {
    if (tokens.length === 0) {
      return {
        isValid: false,
        error: "Empty sentence",
        errorPosition: 0
      };
    }

    const n = tokens.length;
    const table: Set<string>[][][] = Array(n).fill(null).map(() =>
      Array(n).fill(null).map(() => Array(n).fill(null).map(() => new Set<string>()))
    );

    // Fill diagonal (terminals)
    for (let i = 0; i < n; i++) {
      const token = tokens[i].toLowerCase();
      let found = false;
      
      for (const [nonTerminal, productions] of this.rules.entries()) {
        for (const production of productions) {
          if (production.length === 1 && production[0] === token) {
            table[0][i][i].add(nonTerminal);
            found = true;
          }
        }
      }
      
      if (!found) {
        return {
          isValid: false,
          error: `Unknown word: "${token}"`,
          errorPosition: i,
          errorWord: token
        };
      }
    }

    // Fill table using CYK algorithm
    for (let length = 2; length <= n; length++) {
      for (let i = 0; i <= n - length; i++) {
        const j = i + length - 1;
        
        for (let k = i; k < j; k++) {
          for (const [nonTerminal, productions] of this.rules.entries()) {
            for (const production of productions) {
              if (production.length === 2) {
                const [left, right] = production;
                if (table[k - i][i][k].has(left) && table[j - k - 1][k + 1][j].has(right)) {
                  table[length - 1][i][j].add(nonTerminal);
                }
              }
            }
          }
        }
      }
    }

    // Check if sentence is valid (S is in the top cell)
    const isValid = table[n - 1][0][n - 1].has('S');
    
    if (isValid) {
      const parseTree = this.buildParseTree(tokens, table);
      return {
        isValid: true,
        parseTree
      };
    } else {
      return {
        isValid: false,
        error: this.generateErrorMessage(tokens, table),
        errorPosition: this.findErrorPosition(tokens, table)
      };
    }
  }

  private buildParseTree(tokens: string[], table: Set<string>[][][]): ParseNode {
    const n = tokens.length;
    
    const buildNode = (start: number, end: number, symbol: string): ParseNode => {
      if (start === end) {
        return {
          label: symbol,
          children: [],
          word: tokens[start]
        };
      }
      
      // Find the split point
      for (let k = start; k < end; k++) {
        for (const [nonTerminal, productions] of this.rules.entries()) {
          if (nonTerminal === symbol) {
            for (const production of productions) {
              if (production.length === 2) {
                const [left, right] = production;
                if (table[k - start][start][k].has(left) && table[end - k - 1][k + 1][end].has(right)) {
                  return {
                    label: symbol,
                    children: [
                      buildNode(start, k, left),
                      buildNode(k + 1, end, right)
                    ]
                  };
                }
              }
            }
          }
        }
      }
      
      return { label: symbol, children: [] };
    };
    
    return buildNode(0, n - 1, 'S');
  }

  private generateErrorMessage(tokens: string[], table: Set<string>[][][]): string {
    const n = tokens.length;
    
    // Check for common error patterns
    if (n === 1) {
      return "Single word cannot form a complete sentence. Expected: Determiner + Noun + Verb (+ optional Noun Phrase)";
    }
    
    // Check if we have basic components
    let hasDet = false, hasN = false, hasV = false;
    
    for (let i = 0; i < n; i++) {
      if (table[0][i][i].has('Det')) hasDet = true;
      if (table[0][i][i].has('N')) hasN = true;
      if (table[0][i][i].has('V')) hasV = true;
    }
    
    if (!hasDet) return "Missing determiner ('the' or 'a')";
    if (!hasN) return "Missing noun";
    if (!hasV) return "Missing verb";
    
    // Check for NP formation
    let hasNP = false;
    for (let length = 2; length <= n; length++) {
      for (let i = 0; i <= n - length; i++) {
        if (table[length - 1][i][i + length - 1].has('NP')) {
          hasNP = true;
          break;
        }
      }
    }
    
    if (!hasNP) return "Cannot form noun phrase. Expected: Determiner + Noun";
    
    return "Invalid sentence structure. Expected: Noun Phrase + Verb Phrase";
  }

  private findErrorPosition(tokens: string[], table: Set<string>[][][]): number {
    // Find the first position where parsing fails
    for (let i = 0; i < tokens.length; i++) {
      if (table[0][i][i].size === 0) {
        return i;
      }
    }
    return 0;
  }
}

const parser = new CYKParser();

export const validateSentence = (sentence: string): ValidationResult => {
  if (!sentence.trim()) {
    return {
      isValid: false,
      error: "Please enter a sentence to validate",
      errorPosition: 0
    };
  }
  
  const tokens = sentence.trim().toLowerCase().split(/\s+/);
  return parser.parse(tokens);
};

export const getGrammarRules = (): ParseRule[] => {
  return [...GRAMMAR_RULES];
};

export const formatGrammarRules = (): string => {
  const rulesMap = new Map<string, string[]>();
  
  GRAMMAR_RULES.forEach(rule => {
    if (!rulesMap.has(rule.left)) {
      rulesMap.set(rule.left, []);
    }
    rulesMap.get(rule.left)!.push(rule.right.join(' '));
  });
  
  let formatted = '';
  for (const [left, rights] of rulesMap.entries()) {
    formatted += `${left} -> ${rights.join(' | ')}\n`;
  }
  
  return formatted;
};