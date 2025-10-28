'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface LoremIpsumToolProps {
  toolData: Tool;
}

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export function LoremIpsumTool({ toolData }: LoremIpsumToolProps) {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [startWithLorem, setStartWithLorem] = useState(true);

  const generateWord = () => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  };

  const generateSentence = () => {
    const wordCount = Math.floor(Math.random() * 10) + 5; // 5-15 words per sentence
    let sentence = [];
    for (let i = 0; i < wordCount; i++) {
      sentence.push(generateWord());
    }
    // Capitalize first letter
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
    return sentence.join(' ') + '.';
  };

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-7 sentences per paragraph
    let sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence());
    }
    return sentences.join(' ');
  };

  const handleGenerate = () => {
    let result = '';

    if (unit === 'paragraphs') {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      result = paragraphs.join('\n\n');
    } else if (unit === 'sentences') {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      result = sentences.join(' ');
    } else if (unit === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(generateWord());
      }
      result = words.join(' ') + '.';
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    // Optionally start with "Lorem ipsum dolor sit amet"
    if (startWithLorem && result) {
      result = 'Lorem ipsum dolor sit amet, ' + result.substring(result.indexOf(' ') + 1);
    }

    setOutput(result);

    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate',
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
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">COUNT</label>
          <Input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
            min="1"
            max="100"
            className="bg-slate-800 border-slate-600"
          />
        </div>

        <div>
          <label className="text-purple-300 font-semibold mb-2 block">UNIT</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as any)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-star"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
      </div>

      {/* Options */}
      <div>
        <label className="flex items-center gap-3 text-white cursor-pointer">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="w-4 h-4 accent-violet-nebula"
          />
          <span>Start with "Lorem ipsum dolor sit amet..."</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleGenerate}>
          Generate Lorem Ipsum
        </Button>
        <Button variant="secondary" onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy Text'}
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Output Section */}
      {output && (
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">GENERATED TEXT</label>
          <div className="min-h-[200px] bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 text-white overflow-auto">
            <p className="whitespace-pre-wrap">{output}</p>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            {output.split(/\s+/).length} words • {output.length} characters
          </p>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ About Lorem Ipsum</h3>
        <p className="text-sm text-slate-300">
          Lorem Ipsum is placeholder text commonly used in graphic design, publishing, and web development
          to demonstrate visual form without relying on meaningful content. It's been the industry standard
          since the 1500s.
        </p>
      </div>
    </div>
  );
}
