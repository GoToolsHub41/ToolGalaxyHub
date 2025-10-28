'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface Base64EncoderToolProps {
  toolData: Tool;
}

export function Base64EncoderTool({ toolData }: Base64EncoderToolProps) {
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

      const encoded = btoa(input);
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
      setError(`Encoding error: ${err.message}. The text may contain characters that cannot be encoded.`);
    }
  };

  const handleDecode = () => {
    try {
      if (!input.trim()) {
        setError('Please enter Base64 text to decode');
        return;
      }

      const decoded = atob(input);
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
      setError(`Decoding error: ${err.message}. Make sure your input is valid Base64-encoded text.`);
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
          INPUT {mode === 'encode' ? '(Plain Text)' : '(Base64 Text)'}
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            mode === 'encode'
              ? 'Enter text to encode to Base64...'
              : 'Enter Base64-encoded text to decode...'
          }
          className="min-h-[200px] bg-slate-800 border-slate-600 text-white font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        {mode === 'encode' ? (
          <Button onClick={handleEncode} disabled={!input.trim()}>
            Encode to Base64
          </Button>
        ) : (
          <Button onClick={handleDecode} disabled={!input.trim()}>
            Decode from Base64
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
            OUTPUT {mode === 'encode' ? '(Base64)' : '(Decoded Text)'}
          </label>
          <div className="min-h-[200px] bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 text-white font-mono text-sm overflow-auto">
            <pre className="whitespace-pre-wrap break-all">{output}</pre>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ About Base64</h3>
        <p className="text-sm text-slate-300 mb-2">
          Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format.
          It's commonly used to encode data for transmission over media that only support text content.
        </p>
        <p className="text-sm text-slate-400">
          <strong>Common uses:</strong> Email attachments, data URLs, embedding images in HTML/CSS, API authentication tokens
        </p>
      </div>
    </div>
  );
}
