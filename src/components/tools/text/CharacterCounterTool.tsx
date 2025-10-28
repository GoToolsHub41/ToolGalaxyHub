'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface CharacterCounterToolProps {
  toolData: Tool;
}

export function CharacterCounterTool({ toolData }: CharacterCounterToolProps) {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    noSpaces: 0,
    letters: 0,
    digits: 0,
    punctuation: 0,
    whitespace: 0,
    uppercase: 0,
    lowercase: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    calculateStats(input);
  }, [input]);

  const calculateStats = (text: string) => {
    const total = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const digits = (text.match(/\d/g) || []).length;
    const punctuation = (text.match(/[.,!?;:'"()\[\]{}]/g) || []).length;
    const whitespace = (text.match(/\s/g) || []).length;
    const uppercase = (text.match(/[A-Z]/g) || []).length;
    const lowercase = (text.match(/[a-z]/g) || []).length;

    setStats({
      total,
      noSpaces,
      letters,
      digits,
      punctuation,
      whitespace,
      uppercase,
      lowercase,
    });

    if (text.length > 0) {
      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    }
  };

  const handleCopyStats = async () => {
    const statsText = `Character Statistics:
Total Characters: ${stats.total}
Without Spaces: ${stats.noSpaces}
Letters: ${stats.letters}
Digits: ${stats.digits}
Punctuation: ${stats.punctuation}
Whitespace: ${stats.whitespace}
Uppercase: ${stats.uppercase}
Lowercase: ${stats.lowercase}`;

    const success = await copyToClipboard(statsText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">ENTER YOUR TEXT</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing or paste your text to count characters..."
          className="min-h-[300px] bg-slate-800 border-slate-600 text-white text-sm"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button variant="secondary" onClick={handleCopyStats} disabled={!input.trim()}>
          {copied ? 'Copied!' : 'Copy Statistics'}
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-2 border-violet-nebula rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.total.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Total Characters</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-star rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.noSpaces.toLocaleString()}</div>
          <div className="text-sm text-slate-300">No Spaces</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.letters.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Letters</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.digits.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Digits</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.punctuation.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Punctuation</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.whitespace.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Whitespace</div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.uppercase.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Uppercase</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-2 border-pink-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.lowercase.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Lowercase</div>
        </div>
      </div>
    </div>
  );
}
