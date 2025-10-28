'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface UuidGeneratorToolProps {
  toolData: Tool;
}

export function UuidGeneratorTool({ toolData }: UuidGeneratorToolProps) {
  const [uuid, setUuid] = useState('');
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState('');
  const [version, setVersion] = useState<'v4' | 'v1'>('v4');

  const generateUUID = () => {
    // UUID v4 generation (random)
    if (version === 'v4') {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    } else {
      // UUID v1 generation (timestamp-based, simplified)
      const timestamp = new Date().getTime();
      const random = Math.random().toString(16).substring(2, 15);
      return `${timestamp.toString(16)}-${random}-1xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
  };

  const handleGenerate = () => {
    const generated = generateUUID();
    setUuid(generated);

    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate_single',
    });

    trackEvent('tool_completed', {
      tool_name: toolData.name,
      processing_time_ms: 0,
      success: true,
    });
  };

  const handleGenerateMultiple = () => {
    const generated: string[] = [];
    for (let i = 0; i < count; i++) {
      generated.push(generateUUID());
    }
    setUuids(generated);

    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate_multiple',
    });
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(text);
      setTimeout(() => setCopied(''), 2000);
    }
  };

  const handleCopyAll = async () => {
    const allUuids = uuids.join('\n');
    await copyToClipboard(allUuids);
    setCopied('all');
    setTimeout(() => setCopied(''), 2000);
  };

  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  return (
    <div className="space-y-6">
      {/* Version Selector */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">UUID VERSION</label>
        <div className="flex gap-2 p-1 bg-slate-800 rounded-lg w-fit">
          <button
            onClick={() => setVersion('v4')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              version === 'v4'
                ? 'bg-violet-nebula text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            UUID v4 (Random)
          </button>
          <button
            onClick={() => setVersion('v1')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              version === 'v1'
                ? 'bg-violet-nebula text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            UUID v1 (Timestamp)
          </button>
        </div>
      </div>

      {/* Single UUID Display */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">GENERATED UUID</label>
        <div className="bg-slate-800 border-2 border-cyan-500 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <code className="text-2xl font-mono text-white break-all flex-1 mr-4 select-all">
              {uuid}
            </code>
            <Button variant="secondary" onClick={() => handleCopy(uuid)} className="text-sm whitespace-nowrap">
              {copied === uuid ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Button onClick={handleGenerate}>
            Generate New UUID
          </Button>
        </div>
      </div>

      {/* Multiple UUIDs Generator */}
      <div>
        <label className="text-purple-300 font-semibold mb-3 block">GENERATE MULTIPLE UUIDs</label>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-slate-300 mb-2 block text-sm">Number of UUIDs</label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              min="1"
              max="100"
              className="bg-slate-800 border-slate-600"
            />
          </div>
          <Button onClick={handleGenerateMultiple}>
            Generate {count} UUIDs
          </Button>
        </div>
      </div>

      {/* Multiple UUIDs Display */}
      {uuids.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-purple-300 font-semibold">GENERATED UUIDs ({uuids.length})</label>
            <Button variant="secondary" onClick={handleCopyAll} className="text-sm">
              {copied === 'all' ? 'Copied All!' : 'Copy All'}
            </Button>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {uuids.map((id, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-900 p-3 rounded font-mono text-sm group"
                >
                  <code className="text-white break-all flex-1 mr-3 select-all">{id}</code>
                  <button
                    onClick={() => handleCopy(id)}
                    className="text-cyan-star hover:text-cyan-400 transition-colors text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap"
                  >
                    {copied === id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ About UUIDs</h3>
        <div className="text-sm text-slate-300 space-y-2">
          <p><strong className="text-white">UUID (Universally Unique Identifier)</strong> is a 128-bit number used to identify information in computer systems.</p>
          <div className="space-y-1">
            <p><strong className="text-white">UUID v4:</strong> Generated using random or pseudo-random numbers. Most commonly used.</p>
            <p><strong className="text-white">UUID v1:</strong> Generated using timestamp and MAC address. Useful for time-based sorting.</p>
          </div>
          <p className="text-slate-400"><strong>Common uses:</strong> Database primary keys, session IDs, file names, distributed systems</p>
        </div>
      </div>
    </div>
  );
}
