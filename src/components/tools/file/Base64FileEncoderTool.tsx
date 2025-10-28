'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface Base64FileEncoderToolProps {
  toolData: Tool;
}

export function Base64FileEncoderTool({ toolData }: Base64FileEncoderToolProps) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [base64Input, setBase64Input] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    setUploadedFile(file);
    setError('');
    setIsProcessing(true);

    try {
      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'encode_file',
      });

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1]; // Remove data URL prefix
        setOutput(base64);
        setIsProcessing(false);

        trackEvent('tool_completed', {
          tool_name: toolData.name,
          processing_time_ms: 0,
          success: true,
        });
      };
      reader.onerror = () => {
        setError('Error reading file');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(`Error encoding file: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const handleDecode = () => {
    if (!base64Input.trim()) {
      setError('Please enter Base64 data to decode');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');

      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'decode_file',
      });

      // Decode Base64 to binary
      const binaryString = atob(base64Input);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create blob
      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      setOutput(url);
      setIsProcessing(false);

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    } catch (err: any) {
      setError(`Decoding error: ${err.message}. Make sure your input is valid Base64 data.`);
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadEncoded = () => {
    if (!output) return;
    downloadFile(output, 'encoded.txt', 'text/plain');

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: 'txt',
      file_size_kb: Math.round(new Blob([output]).size / 1024),
    });
  };

  const handleDownloadDecoded = () => {
    if (!output) return;

    const a = document.createElement('a');
    a.href = output;
    a.download = 'decoded-file';
    a.click();

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: 'file',
      file_size_kb: 0,
    });
  };

  const handleClear = () => {
    setUploadedFile(null);
    setBase64Input('');
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
            handleClear();
          }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'encode'
              ? 'bg-violet-nebula text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Encode File
        </button>
        <button
          onClick={() => {
            setMode('decode');
            handleClear();
          }}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            mode === 'decode'
              ? 'bg-violet-nebula text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Decode File
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Encode Mode */}
      {mode === 'encode' && !output && (
        <FileUpload
          onFileSelect={handleFileUpload}
          accept="*/*"
          maxSize={10 * 1024 * 1024}
          label="Upload File to Encode"
        />
      )}

      {/* Decode Mode */}
      {mode === 'decode' && !output && (
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">BASE64 INPUT</label>
          <Textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="Paste Base64-encoded data here..."
            className="min-h-[200px] bg-slate-800 border-slate-600 text-white font-mono text-sm"
          />
          <div className="mt-3">
            <Button onClick={handleDecode} disabled={!base64Input.trim() || isProcessing}>
              {isProcessing ? 'Decoding...' : 'Decode File'}
            </Button>
          </div>
        </div>
      )}

      {/* Output for Encoded File */}
      {mode === 'encode' && output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-purple-300 font-semibold">BASE64 OUTPUT</label>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleCopy} className="text-sm">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="secondary" onClick={handleDownloadEncoded} className="text-sm">
                Download as TXT
              </Button>
              <Button variant="secondary" onClick={handleClear} className="text-sm">
                Clear
              </Button>
            </div>
          </div>
          <div className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 max-h-96 overflow-auto">
            <pre className="text-white font-mono text-xs break-all whitespace-pre-wrap">{output}</pre>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            Original file: {uploadedFile?.name} ({Math.round((uploadedFile?.size || 0) / 1024)} KB)
            <br />
            Base64 size: {Math.round(new Blob([output]).size / 1024)} KB
          </p>
        </div>
      )}

      {/* Output for Decoded File */}
      {mode === 'decode' && output && (
        <div>
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-6 text-center">
            <svg className="w-16 h-16 text-green-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-white font-semibold mb-2">File Decoded Successfully!</h3>
            <p className="text-slate-300 mb-4">Your file is ready to download.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleDownloadDecoded}>
                Download Decoded File
              </Button>
              <Button variant="secondary" onClick={handleClear}>
                Decode Another
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ About Base64 File Encoding</h3>
        <p className="text-sm text-slate-300 mb-2">
          Base64 encoding converts binary file data into ASCII text format. This is useful for:
        </p>
        <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
          <li>Embedding files in HTML, CSS, or JSON</li>
          <li>Sending files through text-only channels (email, APIs)</li>
          <li>Creating data URIs for images and other resources</li>
          <li>Storing binary data in text-based formats</li>
        </ul>
        <p className="text-sm text-slate-400 mt-2">
          <strong>Note:</strong> Base64 encoding increases file size by approximately 33%.
          Maximum file size: 10MB
        </p>
      </div>
    </div>
  );
}
