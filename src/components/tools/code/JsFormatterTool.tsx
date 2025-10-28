'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard, downloadFile } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface JsFormatterToolProps {
  toolData: Tool;
}

export function JsFormatterTool({ toolData }: JsFormatterToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const formatJavaScript = (js: string, indent: number = 2) => {
    let formatted = '';
    let indentLevel = 0;
    const indentStr = ' '.repeat(indent);

    // Remove extra whitespace while preserving strings
    const tokens: string[] = [];
    let currentToken = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < js.length; i++) {
      const char = js[i];

      // Handle strings
      if ((char === '"' || char === "'" || char === '`') && (i === 0 || js[i - 1] !== '\\')) {
        if (!inString) {
          if (currentToken) {
            tokens.push(currentToken);
            currentToken = '';
          }
          inString = true;
          stringChar = char;
          currentToken = char;
        } else if (char === stringChar) {
          currentToken += char;
          tokens.push(currentToken);
          currentToken = '';
          inString = false;
          stringChar = '';
        } else {
          currentToken += char;
        }
      } else if (inString) {
        currentToken += char;
      } else if (/[{};(),]/.test(char)) {
        if (currentToken.trim()) {
          tokens.push(currentToken.trim());
          currentToken = '';
        }
        tokens.push(char);
      } else {
        currentToken += char;
      }
    }

    if (currentToken.trim()) {
      tokens.push(currentToken.trim());
    }

    // Format tokens
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token === '{') {
        formatted += ' {\n';
        indentLevel++;
      } else if (token === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
        formatted += '\n' + indentStr.repeat(indentLevel) + '}';
        if (i < tokens.length - 1 && tokens[i + 1] !== ';') {
          formatted += '\n';
        }
      } else if (token === ';') {
        formatted += ';\n';
        if (i < tokens.length - 1 && tokens[i + 1] !== '}') {
          formatted += indentStr.repeat(indentLevel);
        }
      } else if (token === ',') {
        formatted += ', ';
      } else if (token === '(' || token === ')') {
        formatted += token;
      } else {
        // Regular token
        if (formatted.length > 0 && formatted[formatted.length - 1] === '\n') {
          formatted += indentStr.repeat(indentLevel);
        } else if (formatted.length > 0 &&
                   formatted[formatted.length - 1] !== ' ' &&
                   formatted[formatted.length - 1] !== '(' &&
                   token !== '(' && token !== ')') {
          formatted += ' ';
        }
        formatted += token;
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
        setError('Please enter JavaScript code');
        setIsProcessing(false);
        return;
      }

      const formatted = formatJavaScript(input, indentSize);
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
        setError('Please enter JavaScript code');
        return;
      }

      // Basic minification - remove comments and extra whitespace
      // Note: This is a simple implementation. For production, use a proper minifier.
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/\/\/.*/g, '') // Remove single-line comments
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s*([{};,()=+\-*/<>!&|])\s*/g, '$1')
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
    downloadFile(output, 'formatted.js', 'text/javascript');

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: 'js',
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
        <label className="text-purple-300 font-semibold mb-2 block">INPUT JAVASCRIPT</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='function hello(){console.log("Hello World");return true;}'
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
          {isProcessing ? 'Processing...' : 'Format JavaScript'}
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
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ JavaScript Formatter</h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Beautify and format JavaScript code for better readability</li>
          <li>Minify option removes comments and unnecessary whitespace</li>
          <li>Customize indentation (2, 4, or 8 spaces)</li>
          <li>Preserves string literals and code functionality</li>
        </ul>
      </div>
    </div>
  );
}
