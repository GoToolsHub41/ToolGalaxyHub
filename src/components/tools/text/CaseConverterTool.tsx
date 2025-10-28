'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface CaseConverterToolProps {
  toolData: Tool;
}

export function CaseConverterTool({ toolData }: CaseConverterToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [selectedCase, setSelectedCase] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const convertToUpperCase = () => {
    const result = input.toUpperCase();
    setOutput(result);
    setSelectedCase('upper');
    trackConversion('uppercase');
  };

  const convertToLowerCase = () => {
    const result = input.toLowerCase();
    setOutput(result);
    setSelectedCase('lower');
    trackConversion('lowercase');
  };

  const convertToTitleCase = () => {
    const result = input.toLowerCase().replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
    setOutput(result);
    setSelectedCase('title');
    trackConversion('titlecase');
  };

  const convertToSentenceCase = () => {
    const result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (match) => match.toUpperCase());
    setOutput(result);
    setSelectedCase('sentence');
    trackConversion('sentencecase');
  };

  const convertToCamelCase = () => {
    const result = input
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
    setOutput(result);
    setSelectedCase('camel');
    trackConversion('camelcase');
  };

  const convertToSnakeCase = () => {
    const result = input
      .replace(/\s+/g, '_')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .toLowerCase();
    setOutput(result);
    setSelectedCase('snake');
    trackConversion('snakecase');
  };

  const convertToKebabCase = () => {
    const result = input
      .replace(/\s+/g, '-')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
    setOutput(result);
    setSelectedCase('kebab');
    trackConversion('kebabcase');
  };

  const convertToToggleCase = () => {
    const result = input.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    }).join('');
    setOutput(result);
    setSelectedCase('toggle');
    trackConversion('togglecase');
  };

  const trackConversion = (caseType: string) => {
    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: caseType,
    });

    trackEvent('tool_completed', {
      tool_name: toolData.name,
      processing_time_ms: 0,
      success: true,
    });
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setSelectedCase('');
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">INPUT TEXT</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your text here to convert to different cases..."
          className="min-h-[200px] bg-slate-800 border-slate-600 text-white"
        />
      </div>

      {/* Conversion Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          onClick={convertToUpperCase}
          disabled={!input.trim()}
          variant={selectedCase === 'upper' ? 'primary' : 'secondary'}
        >
          UPPERCASE
        </Button>
        <Button
          onClick={convertToLowerCase}
          disabled={!input.trim()}
          variant={selectedCase === 'lower' ? 'primary' : 'secondary'}
        >
          lowercase
        </Button>
        <Button
          onClick={convertToTitleCase}
          disabled={!input.trim()}
          variant={selectedCase === 'title' ? 'primary' : 'secondary'}
        >
          Title Case
        </Button>
        <Button
          onClick={convertToSentenceCase}
          disabled={!input.trim()}
          variant={selectedCase === 'sentence' ? 'primary' : 'secondary'}
        >
          Sentence case
        </Button>
        <Button
          onClick={convertToCamelCase}
          disabled={!input.trim()}
          variant={selectedCase === 'camel' ? 'primary' : 'secondary'}
        >
          camelCase
        </Button>
        <Button
          onClick={convertToSnakeCase}
          disabled={!input.trim()}
          variant={selectedCase === 'snake' ? 'primary' : 'secondary'}
        >
          snake_case
        </Button>
        <Button
          onClick={convertToKebabCase}
          disabled={!input.trim()}
          variant={selectedCase === 'kebab' ? 'primary' : 'secondary'}
        >
          kebab-case
        </Button>
        <Button
          onClick={convertToToggleCase}
          disabled={!input.trim()}
          variant={selectedCase === 'toggle' ? 'primary' : 'secondary'}
        >
          tOGGLE cASE
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button variant="secondary" onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy Result'}
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Output Section */}
      {output && (
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">OUTPUT</label>
          <div className="min-h-[200px] bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 text-white overflow-auto">
            <pre className="whitespace-pre-wrap break-words">{output}</pre>
          </div>
        </div>
      )}

      {/* Case Explanations */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <h3 className="text-cyan-star font-semibold mb-3">📝 Case Type Explanations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <strong className="text-white">UPPERCASE:</strong>
            <span className="text-slate-400"> All letters capitalized</span>
          </div>
          <div>
            <strong className="text-white">lowercase:</strong>
            <span className="text-slate-400"> All letters in lowercase</span>
          </div>
          <div>
            <strong className="text-white">Title Case:</strong>
            <span className="text-slate-400"> First Letter Of Each Word Capitalized</span>
          </div>
          <div>
            <strong className="text-white">Sentence case:</strong>
            <span className="text-slate-400"> First letter of sentences capitalized</span>
          </div>
          <div>
            <strong className="text-white">camelCase:</strong>
            <span className="text-slate-400"> firstWordLowercaseRestCapitalized</span>
          </div>
          <div>
            <strong className="text-white">snake_case:</strong>
            <span className="text-slate-400"> words_separated_by_underscores</span>
          </div>
          <div>
            <strong className="text-white">kebab-case:</strong>
            <span className="text-slate-400"> words-separated-by-hyphens</span>
          </div>
          <div>
            <strong className="text-white">tOGGLE cASE:</strong>
            <span className="text-slate-400"> Inverts the case of each letter</span>
          </div>
        </div>
      </div>
    </div>
  );
}
