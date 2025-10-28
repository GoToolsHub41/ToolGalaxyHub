'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface CssFormatterToolProps {
  toolData: Tool;
}

export function CssFormatterTool({ toolData }: CssFormatterToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const formatCSS = (css: string, indent: number = 2) => {
    let formatted = '';
    let indentLevel = 0;
    const indentStr = ' '.repeat(indent);

    // Remove extra whitespace and newlines
    css = css.replace(/\s+/g, ' ').trim();

    let i = 0;
    while (i < css.length) {
      const char = css[i];

      if (char === '{') {
        formatted += ' {\n';
        indentLevel++;
        i++;
        // Skip whitespace after opening brace
        while (i < css.length && /\s/.test(css[i])) i++;
      } else if (char === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
        formatted += '\n' + indentStr.repeat(indentLevel) + '}\n';
        i++;
      } else if (char === ';') {
        formatted += ';\n';
        i++;
        // Skip whitespace after semicolon
        while (i < css.length && /\s/.test(css[i])) i++;
        // Add indentation for next property
        if (i < css.length && css[i] !== '}') {
          formatted += indentStr.repeat(indentLevel);
        }
      } else if (char === ',') {
        formatted += ',\n' + indentStr.repeat(indentLevel);
        i++;
        // Skip whitespace after comma
        while (i < css.length && /\s/.test(css[i])) i++;
      } else {
        // Regular character
        if (formatted.length === 0 || formatted[formatted.length - 1] === '\n') {
          formatted += indentStr.repeat(indentLevel);
        }
        formatted += char;
        i++;
      }
    }

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
        setError('Please enter CSS code');
        setIsProcessing(false);
        return;
      }

      const formatted = formatCSS(input, indentSize);
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
        setError('Please enter CSS code');
        return;
      }

      // Remove all whitespace, newlines, and comments
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\n/g, '')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s*{\s*/g, '{')
        .replace(/\s*}\s*/g, '}')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s*;\s*/g, ';')
        .replace(/\s*,\s*/g, ',')
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
    downloadFile(output, 'formatted.css', 'text/css');

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: 'css',
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
        <label className="text-purple-300 font-semibold mb-2 block">INPUT CSS</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='.container{display:flex;justify-content:center;align-items:center;}'
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
          {isProcessing ? 'Processing...' : 'Format CSS'}
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
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ CSS Formatter</h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Beautify and format CSS code for better readability</li>
          <li>Minify option removes all unnecessary whitespace and comments</li>
          <li>Customize indentation (2, 4, or 8 spaces)</li>
          <li>Works with any valid CSS code</li>
        </ul>
      </div>
    </div>
  );
}
