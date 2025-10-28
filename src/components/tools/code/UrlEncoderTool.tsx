'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface UrlEncoderToolProps {
  toolData: Tool;
}

export function UrlEncoderTool({ toolData }: UrlEncoderToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      if (!input.trim()) {
        setError('Please enter text to encode');
        return;
      }

      const encoded = encodeURIComponent(input);
      setOutput(encoded);
      setError('');

      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'encode',
      });

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    } catch (err: any) {
      setError(`Encoding error: ${err.message}`);
    }
  };

  const handleDecode = () => {
    try {
      if (!input.trim()) {
        setError('Please enter text to decode');
        return;
      }

      const decoded = decodeURIComponent(input);
      setOutput(decoded);
      setError('');

      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'decode',
      });

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    } catch (err: any) {
      setError(`Decoding error: ${err.message}. Make sure your input is valid URL-encoded text.`);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSwap = () => {
    const temp = input;
    setInput(output);
    setOutput(temp);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-slate-800 rounded-lg w-fit">
        <button
          onClick={() => {
            setMode('encode');
            setOutput('');
            setError('');
          }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-violet-nebula text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => {
            setMode('decode');
            setOutput('');
            setError('');
          }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-violet-nebula text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Decode
        </button>
      </div>

      {/* Input Section */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">
          INPUT {mode === 'encode' ? '(Plain Text)' : '(URL Encoded Text)'}
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'encode'
              ? 'Enter text to encode (e.g., hello world & special chars!)'
              : 'Enter URL-encoded text to decode (e.g., hello%20world)'
          }
          className="min-h-[200px] bg-slate-800 border-slate-600 text-white font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        {mode === 'encode' ? (
          <Button onClick={handleEncode} disabled={!input.trim()}>
            Encode URL
          </Button>
        ) : (
          <Button onClick={handleDecode} disabled={!input.trim()}>
            Decode URL
          </Button>
        )}
        <Button variant="secondary" onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy Result'}
        </Button>
        <Button variant="secondary" onClick={handleSwap} disabled={!output}>
          Swap Input/Output
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">
            OUTPUT {mode === 'encode' ? '(URL Encoded)' : '(Decoded Text)'}
          </label>
          <div className="min-h-[200px] bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 text-white font-mono text-sm overflow-auto">
            <pre className="whitespace-pre-wrap break-all">{output}</pre>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ About URL Encoding</h3>
        <p className="text-sm text-slate-300 mb-2">
          URL encoding converts characters into a format that can be transmitted over the Internet.
          Special characters are replaced with a '%' followed by two hexadecimal digits.
        </p>
        <p className="text-sm text-slate-400">
          <strong>Examples:</strong> Space → %20, & → %26, ? → %3F, # → %23
        </p>
      </div>
    </div>
  );
}
