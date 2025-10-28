'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface TextReverserToolProps {
  toolData: Tool;
}

export function TextReverserTool({ toolData }: TextReverserToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'all' | 'words' | 'lines'>('all');
  const [copied, setCopied] = useState(false);

  const handleReverse = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let result = '';

    if (mode === 'all') {
      // Reverse entire text
      result = input.split('').reverse().join('');
    } else if (mode === 'words') {
      // Reverse word order but keep words intact
      result = input.split(/\s+/).reverse().join(' ');
    } else if (mode === 'lines') {
      // Reverse line order
      result = input.split('\n').reverse().join('\n');
    }

    setOutput(result);

    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: `reverse_${mode}`,
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
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">REVERSE MODE</label>
        <div className="flex gap-2 p-1 bg-slate-800 rounded-lg w-fit">
          <button
            onClick={() => {
              setMode('all');
              setOutput('');
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              mode === 'all'
                ? 'bg-violet-nebula text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Characters
          </button>
          <button
            onClick={() => {
              setMode('words');
              setOutput('');
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              mode === 'words'
                ? 'bg-violet-nebula text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Word Order
          </button>
          <button
            onClick={() => {
              setMode('lines');
              setOutput('');
            }}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              mode === 'lines'
                ? 'bg-violet-nebula text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Line Order
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">INPUT TEXT</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to reverse..."
          className="min-h-[200px] bg-slate-800 border-slate-600 text-white"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleReverse} disabled={!input.trim()}>
          Reverse Text
        </Button>
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

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ Reverse Modes</h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li><strong>All Characters:</strong> Reverses every character (Hello → olleH)</li>
          <li><strong>Word Order:</strong> Reverses word order but keeps words intact (Hello World → World Hello)</li>
          <li><strong>Line Order:</strong> Reverses the order of lines</li>
        </ul>
      </div>
    </div>
  );
}
