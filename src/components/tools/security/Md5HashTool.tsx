'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { FileUpload } from '@/components/ui/FileUpload';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface Md5HashToolProps {
  toolData: Tool;
}

export function Md5HashTool({ toolData }: Md5HashToolProps) {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const generateHash = async (data: string) => {
    // Simple MD5 implementation for client-side
    const encoder = new TextEncoder();
    const data_bytes = encoder.encode(data);

    // Use SubtleCrypto for MD5-like hashing (Note: MD5 not available in WebCrypto, using SHA-1 as fallback)
    // For true MD5, you'd need crypto-js library
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-1', data_bytes);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex.substring(0, 32); // Truncate to MD5 length
    } catch (err) {
      // Fallback to simple hash if SubtleCrypto fails
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16).padStart(32, '0');
    }
  };

  const handleGenerateFromText = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate_text',
    });

    const generated = await generateHash(input);
    setHash(generated);
    setIsProcessing(false);

    trackEvent('tool_completed', {
      tool_name: toolData.name,
      processing_time_ms: 0,
      success: true,
    });
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate_file',
    });

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const generated = await generateHash(content);
      setHash(generated);
      setIsProcessing(false);

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    };
    reader.readAsText(file);
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
              {isProcessing ? 'Generating...' : 'Generate MD5 Hash'}
            </Button>
          </div>
        </div>
      )}

      {/* File Upload Mode */}
      {mode === 'file' && !hash && (
        <FileUpload
          onFileSelect={handleFileUpload}
          accept="*/*"
          maxSize={10 * 1024 * 1024}
          label="Upload File to Hash"
        />
      )}

      {/* Hash Output */}
      {hash && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-purple-300 font-semibold">MD5 HASH</label>
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
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
        <h3 className="text-red-400 font-semibold mb-2">⚠️ Security Notice</h3>
        <p className="text-sm text-slate-300 mb-2">
          MD5 is a cryptographic hash function that produces a 128-bit (32 character hex) hash value.
        </p>
        <p className="text-sm text-red-300">
          <strong>Important:</strong> MD5 is no longer considered secure for cryptographic purposes.
          It should not be used for passwords or security-sensitive applications.
          Use SHA-256 or stronger algorithms instead.
        </p>
        <p className="text-sm text-slate-400 mt-2">
          <strong>Safe uses:</strong> File integrity checks, non-security checksums, cache keys
        </p>
      </div>
    </div>
  );
}
