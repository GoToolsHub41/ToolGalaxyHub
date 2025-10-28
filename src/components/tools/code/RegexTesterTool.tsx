'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { Tool } from '@/types/tool';

interface RegexTesterToolProps {
  toolData: Tool;
}

interface Match {
  fullMatch: string;
  groups: string[];
  index: number;
}

export function RegexTesterTool({ toolData }: RegexTesterToolProps) {
  const [pattern, setPattern] = useState('\\w+@\\w+\\.\\w+');
  const [testString, setTestString] = useState('Contact us at support@example.com or sales@company.org for more information.');
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false, y: false });
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState('');
  const [highlightedText, setHighlightedText] = useState('');

  useEffect(() => {
    testRegex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern, testString, flags]);

  const getFlagsString = () => {
    return Object.entries(flags)
      .filter(([_, enabled]) => enabled)
      .map(([flag]) => flag)
      .join('');
  };

  const testRegex = () => {
    setError('');
    setMatches([]);
    setHighlightedText('');

    if (!pattern) {
      return;
    }

    try {
      const flagsString = getFlagsString();
      const regex = new RegExp(pattern, flagsString);

      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'test',
      });

      const foundMatches: Match[] = [];
      let match;

      if (flags.g) {
        // Global flag: find all matches
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
          });

          // Prevent infinite loop on zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // No global flag: find first match only
        match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index,
          });
        }
      }

      setMatches(foundMatches);

      // Create highlighted text
      if (foundMatches.length > 0) {
        let highlighted = '';
        let lastIndex = 0;

        foundMatches.forEach((m, i) => {
          // Add text before match
          highlighted += escapeHtml(testString.substring(lastIndex, m.index));

          // Add highlighted match
          highlighted += `<span class="bg-yellow-400 text-slate-900 font-semibold px-1 rounded">${escapeHtml(m.fullMatch)}</span>`;

          lastIndex = m.index + m.fullMatch.length;

          // Add remaining text after last match
          if (i === foundMatches.length - 1) {
            highlighted += escapeHtml(testString.substring(lastIndex));
          }
        });

        setHighlightedText(highlighted);
      } else {
        setHighlightedText(escapeHtml(testString));
      }

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    } catch (err: any) {
      setError(`Invalid regex: ${err.message}`);

      trackEvent('tool_error', {
        tool_name: toolData.name,
        error_type: 'RegexError',
        error_message: err.message,
      });
    }
  };

  const escapeHtml = (text: string) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const toggleFlag = (flag: keyof typeof flags) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleClear = () => {
    setPattern('');
    setTestString('');
    setMatches([]);
    setHighlightedText('');
    setError('');
  };

  const quickPatterns = [
    { name: 'Email', pattern: '\\w+@\\w+\\.\\w+' },
    { name: 'URL', pattern: 'https?://[\\w\\-\\.]+\\.[a-z]{2,}' },
    { name: 'Phone (US)', pattern: '\\(\\d{3}\\)\\s?\\d{3}-\\d{4}' },
    { name: 'Hex Color', pattern: '#[0-9a-fA-F]{6}' },
    { name: 'IP Address', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
  ];

  return (
    <div className="space-y-6">
      {/* Regex Pattern Input */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">REGEX PATTERN</label>
        <div className="flex gap-2">
          <span className="text-cyan-400 text-2xl self-center">/</span>
          <Input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern"
            className="flex-1 bg-slate-800 border-slate-600 text-white font-mono text-lg"
          />
          <span className="text-cyan-400 text-2xl self-center">/</span>
          <span className="text-cyan-400 text-lg self-center font-mono">{getFlagsString()}</span>
        </div>
      </div>

      {/* Regex Flags */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
        <label className="text-purple-300 font-semibold mb-3 block">FLAGS</label>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[
            { flag: 'g', label: 'Global', desc: 'Find all matches' },
            { flag: 'i', label: 'Case Insensitive', desc: 'Ignore case' },
            { flag: 'm', label: 'Multiline', desc: '^$ match line breaks' },
            { flag: 's', label: 'Dot All', desc: '. matches newlines' },
            { flag: 'u', label: 'Unicode', desc: 'Unicode support' },
            { flag: 'y', label: 'Sticky', desc: 'Match from lastIndex' },
          ].map(({ flag, label, desc }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag as keyof typeof flags)}
              className={`px-3 py-2 rounded-lg transition-all text-left ${
                flags[flag as keyof typeof flags]
                  ? 'bg-violet-nebula text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title={desc}
            >
              <div className="font-mono font-bold text-lg">{flag}</div>
              <div className="text-xs opacity-75">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Patterns */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
        <label className="text-purple-300 font-semibold mb-3 block">QUICK PATTERNS</label>
        <div className="flex flex-wrap gap-2">
          {quickPatterns.map(({ name, pattern: p }) => (
            <button
              key={name}
              onClick={() => setPattern(p)}
              className="px-3 py-1 bg-slate-800 hover:bg-violet-nebula text-slate-300 hover:text-white rounded text-sm transition-colors"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Test String */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">TEST STRING</label>
        <Textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter text to test against the regex pattern..."
          className="min-h-[150px] bg-slate-800 border-slate-600 text-white font-mono"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={testRegex}>
          Test Regex
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

      {/* Results */}
      {!error && (
        <>
          {/* Match Count */}
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-purple-300 font-semibold">RESULTS</h3>
              <span className={`text-lg font-bold ${matches.length > 0 ? 'text-green-400' : 'text-slate-400'}`}>
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
              </span>
            </div>
          </div>

          {/* Highlighted Text */}
          {highlightedText && (
            <div>
              <label className="text-purple-300 font-semibold mb-2 block">HIGHLIGHTED MATCHES</label>
              <div
                className="min-h-[150px] bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 text-white font-mono text-sm whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              />
            </div>
          )}

          {/* Match Details */}
          {matches.length > 0 && (
            <div>
              <label className="text-purple-300 font-semibold mb-3 block">MATCH DETAILS</label>
              <div className="space-y-3">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 border border-slate-600 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-400">Match #{index + 1}</span>
                        <p className="text-white font-mono font-bold mt-1">{match.fullMatch}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Position</span>
                        <p className="text-cyan-400 font-mono mt-1">{match.index}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Length</span>
                        <p className="text-cyan-400 font-mono mt-1">{match.fullMatch.length}</p>
                      </div>
                    </div>
                    {match.groups.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-600">
                        <span className="text-slate-400 text-sm">Capture Groups:</span>
                        <div className="mt-2 space-y-1">
                          {match.groups.map((group, groupIndex) => (
                            <div key={groupIndex} className="flex gap-2 text-sm">
                              <span className="text-slate-400">Group {groupIndex + 1}:</span>
                              <span className="text-white font-mono">{group || '(empty)'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ Regex Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <p className="font-semibold text-white mb-1">Character Classes:</p>
            <ul className="space-y-1 font-mono text-xs">
              <li><span className="text-cyan-400">\\d</span> - Digit (0-9)</li>
              <li><span className="text-cyan-400">\\w</span> - Word character (a-z, A-Z, 0-9, _)</li>
              <li><span className="text-cyan-400">\\s</span> - Whitespace</li>
              <li><span className="text-cyan-400">.</span> - Any character</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Quantifiers:</p>
            <ul className="space-y-1 font-mono text-xs">
              <li><span className="text-cyan-400">*</span> - 0 or more</li>
              <li><span className="text-cyan-400">+</span> - 1 or more</li>
              <li><span className="text-cyan-400">?</span> - 0 or 1</li>
              <li><span className="text-cyan-400">{'{n,m}'}</span> - Between n and m</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
