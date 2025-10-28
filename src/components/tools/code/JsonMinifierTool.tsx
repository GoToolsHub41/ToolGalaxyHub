'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface JsonMinifierToolProps {
  toolData: Tool;
}

export function JsonMinifierTool({ toolData }: JsonMinifierToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ original: 0, minified: 0, savings: 0 });

  const handleMinify = () => {
    const startTime = Date.now();
    setIsProcessing(true);
    setError('');

    try {
      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'minify',
      });

      if (!input.trim()) {
        setError('Please enter JSON data');
        setIsProcessing(false);
        return;
      }

      // Parse and validate JSON
      const parsed = JSON.parse(input);

      // Minify (remove all whitespace)
      const minified = JSON.stringify(parsed);
      setOutput(minified);

      // Calculate size savings
      const originalSize = new Blob([input]).size;
      const minifiedSize = new Blob([minified]).size;
      const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);

      setStats({
        original: originalSize,
        minified: minifiedSize,
        savings: parseFloat(savings)
      });

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

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(output, 'minified.json', 'application/json');

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: 'json',
      file_size_kb: Math.round(stats.minified / 1024),
    });
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setStats({ original: 0, minified: 0, savings: 0 });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">INPUT JSON</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter your JSON to minify...'
          className="min-h-[300px] bg-slate-800 border-slate-600 text-white font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleMinify} disabled={isProcessing || !input.trim()}>
          {isProcessing ? 'Processing...' : 'Minify JSON'}
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

      {/* Stats Display */}
      {output && stats.original > 0 && (
        <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
          <h3 className="text-green-400 font-semibold mb-2">Size Reduction</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-slate-400">Original</div>
              <div className="text-white font-semibold">{stats.original} bytes</div>
            </div>
            <div>
              <div className="text-slate-400">Minified</div>
              <div className="text-white font-semibold">{stats.minified} bytes</div>
            </div>
            <div>
              <div className="text-slate-400">Savings</div>
              <div className="text-green-400 font-bold">{stats.savings}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Output Section */}
      {output && (
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">MINIFIED OUTPUT</label>
          <div className="min-h-[200px] bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 text-white font-mono text-sm overflow-auto">
            <pre className="whitespace-pre-wrap break-all">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
