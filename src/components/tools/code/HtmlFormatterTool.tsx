'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface HtmlFormatterToolProps {
  toolData: Tool;
}

export function HtmlFormatterTool({ toolData }: HtmlFormatterToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const formatHTML = (html: string, indent: number = 2) => {
    let formatted = '';
    let indentLevel = 0;
    const indentStr = ' '.repeat(indent);

    // Remove extra whitespace
    html = html.replace(/>\s+</g, '><').trim();

    // Split by tags
    const tokens = html.split(/(<[^>]+>)/g).filter(token => token.trim());

    tokens.forEach(token => {
      if (token.startsWith('</')) {
        // Closing tag
        indentLevel = Math.max(0, indentLevel - 1);
        formatted += indentStr.repeat(indentLevel) + token + '\n';
      } else if (token.startsWith('<')) {
        // Opening tag
        formatted += indentStr.repeat(indentLevel) + token + '\n';
        // Check if it's a self-closing or void element
        if (!token.endsWith('/>') && !token.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)) {
          indentLevel++;
        }
      } else if (token.trim()) {
        // Text content
        formatted += indentStr.repeat(indentLevel) + token.trim() + '\n';
      }
    });

    return formatted.trim();
  };

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
        setError('Please enter HTML code');
        setIsProcessing(false);
        return;
      }

      const formatted = formatHTML(input, indentSize);
      setOutput(formatted);

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: Date.now() - startTime,
        success: true,
      });
    } catch (err: any) {
      setError(`Formatting error: ${err.message}`);

      trackEvent('tool_error', {
        tool_name: toolData.name,
        error_type: 'FormatError',
        error_message: err.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMinify = () => {
    try {
      if (!input.trim()) {
        setError('Please enter HTML code');
        return;
      }

      // Remove all extra whitespace, newlines, and spaces between tags
      const minified = input
        .replace(/\n/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();

      setOutput(minified);
      setError('');

      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'minify',
      });
    } catch (err: any) {
      setError(`Minification error: ${err.message}`);
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
    downloadFile(output, 'formatted.html', 'text/html');

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: 'html',
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
        <label className="text-purple-300 font-semibold mb-2 block">INPUT HTML</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='<div><h1>Hello World</h1><p>Sample HTML</p></div>'
          className="min-h-[300px] bg-slate-800 border-slate-600 text-white font-mono text-sm"
        />
      </div>

      {/* Options */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
        <label className="text-slate-300 mb-2 block text-sm">Indent Size</label>
        <div className="flex gap-2">
          {[2, 4, 8].map((size) => (
            <button
              key={size}
              onClick={() => setIndentSize(size)}
              className={`px-4 py-2 rounded-md transition-colors ${
                indentSize === size
                  ? 'bg-violet-nebula text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {size} spaces
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleFormat} disabled={isProcessing || !input.trim()}>
          {isProcessing ? 'Processing...' : 'Format HTML'}
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
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
          <div className="mt-2 text-sm text-slate-400">
            Original: {input.length} characters → Formatted: {output.length} characters
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ HTML Formatter</h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Properly indent HTML code for better readability</li>
          <li>Minify option removes all unnecessary whitespace</li>
          <li>Preserves HTML structure and functionality</li>
          <li>Works with any valid HTML code</li>
        </ul>
      </div>
    </div>
  );
}
