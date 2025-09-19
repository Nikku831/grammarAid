import React from 'react';
import { ParseNode } from '../types/grammar';

interface ParseTreeProps {
  parseTree: ParseNode;
  className?: string;
}

const ParseTree: React.FC<ParseTreeProps> = ({ parseTree, className = '' }) => {
  const renderNode = (node: ParseNode, depth: number = 0): JSX.Element => {
    const indent = '  '.repeat(depth);
    
    if (node.word) {
      return (
        <div key={`${depth}-${node.label}-${node.word}`} className="font-mono text-sm">
          <span className="text-gray-500">{indent}</span>
          <span className="text-blue-400">{node.label}</span>
          <span className="text-gray-400"> → </span>
          <span className="text-green-400">"{node.word}"</span>
        </div>
      );
    }
    
    return (
      <div key={`${depth}-${node.label}`} className="font-mono text-sm">
        <div>
          <span className="text-gray-500">{indent}</span>
          <span className="text-blue-400">{node.label}</span>
        </div>
        {node.children.map((child, index) => (
          <div key={index}>
            {renderNode(child, depth + 1)}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${className}`}>
      <h4 className="text-sm font-medium text-gray-300 mb-3">Parse Tree:</h4>
      <div className="text-left">
        {renderNode(parseTree)}
      </div>
    </div>
  );
};

export default ParseTree;