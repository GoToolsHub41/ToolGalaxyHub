'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface JsonFormatterToolProps {
  toolData: Tool;
}

export function JsonFormatterTool({ toolData }: JsonFormatterToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    const startTime = Date.now();
    setIsProcessing(true);
    setError('');

    try {
      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'format',
      });

      if (!input.trim()) {
        setError('Please enter JSON data');
        setIsProcessing(false);
        return;
      }

      // Parse and validate JSON
      const parsed = JSON.parse(input);

      // Pretty-print with 2-space indentation
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: Date.now() - startTime,
        success: true,
      });
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);

      trackEvent('tool_error', {
        tool_name: toolData.name,
        error_type: 'ParseError',
        error_message: err.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleValidate = () => {
    setError('');
    try {
      if (!input.trim()) {
        setError('Please enter JSON data');
        return;
      }

      JSON.parse(input);
      setError('');
      setOutput('✓ Valid JSON');
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      if (!input.trim()) {
        setError('Please enter JSON data');
        return;
      }

      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);

      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'minify',
      });
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(output, 'formatted.json', 'application/json');

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: 'json',
      file_size_kb: Math.round(new Blob([output]).size / 1024),
    });
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">INPUT JSON</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name": "ToolGalaxyHub", "tools": 115}'
          className="min-h-[300px] bg-slate-800 border-slate-600 text-white font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleFormat} disabled={isProcessing || !input.trim()}>
          {isProcessing ? 'Processing...' : 'Format JSON'}
        </Button>
        <Button variant="secondary" onClick={handleValidate} disabled={!input.trim()}>
          Validate
        </Button>
        <Button variant="secondary" onClick={handleMinify} disabled={!input.trim()}>
          Minify
        </Button>
        <Button variant="secondary" onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button variant="secondary" onClick={handleDownload} disabled={!output}>
          Download
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
          <label className="text-purple-300 font-semibold mb-2 block">OUTPUT</label>
          <div className="min-h-[300px] bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 text-white font-mono text-sm overflow-auto">
            <pre className="whitespace-pre-wrap break-words">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
