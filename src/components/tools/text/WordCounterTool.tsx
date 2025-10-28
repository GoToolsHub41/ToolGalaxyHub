'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface WordCounterToolProps {
  toolData: Tool;
}

interface Stats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  speakingTime: number;
}

export function WordCounterTool({ toolData }: WordCounterToolProps) {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<Stats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    lines: 0,
    readingTime: 0,
    speakingTime: 0,
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    calculateStats(input);
  }, [input]);

  const calculateStats = (text: string) => {
    if (!text) {
      setStats({
        characters: 0,
        charactersNoSpaces: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        lines: 0,
        readingTime: 0,
        speakingTime: 0,
      });
      return;
    }

    // Characters
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    // Words (split by whitespace and filter empty strings)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

    // Sentences (split by . ! ? followed by space or end of string)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Paragraphs (split by double newlines or more)
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

    // Lines
    const lines = text.split('\n').length;

    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    // Speaking time (average 130 words per minute)
    const speakingTime = Math.ceil(words / 130);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
    });

    if (text.trim().length > 0) {
      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    }
  };

  const handleCopyStats = async () => {
    const statsText = `Word Count Statistics:
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Sentences: ${stats.sentences}
Paragraphs: ${stats.paragraphs}
Lines: ${stats.lines}
Reading Time: ${stats.readingTime} min
Speaking Time: ${stats.speakingTime} min`;

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
      {/* Input Section */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">ENTER YOUR TEXT</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Start typing or paste your text here to count words, characters, and more..."
          className="min-h-[300px] bg-slate-800 border-slate-600 text-white text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button variant="secondary" onClick={handleCopyStats} disabled={!input.trim()}>
          {copied ? 'Copied!' : 'Copy Statistics'}
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Statistics Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Characters */}
        <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-2 border-violet-nebula rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.characters.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Characters</div>
        </div>

        {/* Characters (No Spaces) */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.charactersNoSpaces.toLocaleString()}</div>
          <div className="text-sm text-slate-300">No Spaces</div>
        </div>

        {/* Words */}
        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-star rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.words.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Words</div>
        </div>

        {/* Sentences */}
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.sentences.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Sentences</div>
        </div>

        {/* Paragraphs */}
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-orange-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.paragraphs.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Paragraphs</div>
        </div>

        {/* Lines */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.lines.toLocaleString()}</div>
          <div className="text-sm text-slate-300">Lines</div>
        </div>

        {/* Reading Time */}
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.readingTime}</div>
          <div className="text-sm text-slate-300">Min to Read</div>
        </div>

        {/* Speaking Time */}
        <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 border-2 border-pink-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">{stats.speakingTime}</div>
          <div className="text-sm text-slate-300">Min to Speak</div>
        </div>
      </div>

      {/* Additional Info */}
      {stats.words > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 className="text-cyan-star font-semibold mb-2">📊 Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
            <div>
              <strong className="text-white">Average word length:</strong> {(stats.charactersNoSpaces / stats.words).toFixed(1)} characters
            </div>
            <div>
              <strong className="text-white">Average sentence length:</strong> {stats.sentences > 0 ? (stats.words / stats.sentences).toFixed(1) : 0} words
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
