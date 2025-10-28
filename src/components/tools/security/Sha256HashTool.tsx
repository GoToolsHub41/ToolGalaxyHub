'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/ui/FileUpload';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface Sha256HashToolProps {
  toolData: Tool;
}

export function Sha256HashTool({ toolData }: Sha256HashToolProps) {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateHash = async (data: string | ArrayBuffer) => {
    let buffer: ArrayBuffer;

    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      buffer = encoder.encode(data);
    } else {
      buffer = data;
    }

    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleGenerateFromText = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate_text',
    });

    try {
      const generated = await generateHash(input);
      setHash(generated);

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    } catch (err: any) {
      console.error('Hash generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate_file',
    });

    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const generated = await generateHash(buffer);
      setHash(generated);
      setIsProcessing(false);

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(hash);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div className="flex gap-2 p-1 bg-slate-800 rounded-lg w-fit">
        <button
          onClick={() => {
            setMode('text');
            setHash('');
          }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'text'
              ? 'bg-violet-nebula text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Text
        </button>
        <button
          onClick={() => {
            setMode('file');
            setHash('');
          }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'file'
              ? 'bg-violet-nebula text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          File
        </button>
      </div>

      {/* Text Input Mode */}
      {mode === 'text' && (
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">INPUT TEXT</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="min-h-[150px] bg-slate-800 border-slate-600 text-white font-mono text-sm"
          />
          <div className="mt-3">
            <Button onClick={handleGenerateFromText} disabled={!input.trim() || isProcessing}>
              {isProcessing ? 'Generating...' : 'Generate SHA-256 Hash'}
            </Button>
          </div>
        </div>
      )}

      {/* File Upload Mode */}
      {mode === 'file' && !hash && (
        <FileUpload
          onFileSelect={handleFileUpload}
          accept="*/*"
          maxSize={50 * 1024 * 1024}
          label="Upload File to Hash"
        />
      )}

      {/* Hash Output */}
      {hash && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-purple-300 font-semibold">SHA-256 HASH</label>
            <Button variant="secondary" onClick={handleCopy} className="text-sm">
              {copied ? 'Copied!' : 'Copy Hash'}
            </Button>
          </div>
          <div className="bg-slate-800 border-2 border-cyan-500 rounded-xl p-6">
            <code className="text-lg font-mono text-white break-all block select-all">
              {hash}
            </code>
          </div>
          <div className="mt-3">
            <Button variant="secondary" onClick={() => {
              setHash('');
              setInput('');
            }}>
              Generate Another
            </Button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
        <h3 className="text-green-400 font-semibold mb-2">✓ About SHA-256</h3>
        <p className="text-sm text-slate-300 mb-2">
          SHA-256 is a cryptographic hash function that produces a 256-bit (64 character hex) hash value.
          It's part of the SHA-2 family designed by the NSA.
        </p>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li><strong className="text-white">Secure:</strong> Widely used and considered cryptographically secure</li>
          <li><strong className="text-white">One-way:</strong> Cannot be reversed to get original data</li>
          <li><strong className="text-white">Deterministic:</strong> Same input always produces same hash</li>
          <li><strong className="text-white">Fast:</strong> Efficient computation</li>
        </ul>
        <p className="text-sm text-slate-400 mt-2">
          <strong>Common uses:</strong> Password hashing (with salt), file integrity verification, digital signatures, blockchain
        </p>
      </div>
    </div>
  );
}
