import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-700/80 text-gray-300 hover:text-white transition-colors duration-150"
          title="Copy code"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
      {language && (
        <div className="absolute left-2 top-2 text-xs text-gray-400 font-mono">
          {language}
        </div>
      )}
      <pre className="rounded-md bg-gray-800 text-gray-200 p-4 mt-0 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;