'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface ColorPickerToolProps {
  toolData: Tool;
}

export function ColorPickerTool({ toolData }: ColorPickerToolProps) {
  const [color, setColor] = useState('#8b5cf6');
  const [hex, setHex] = useState('#8b5cf6');
  const [rgb, setRgb] = useState('rgb(139, 92, 246)');
  const [hsl, setHsl] = useState('hsl(258, 90%, 66%)');
  const [copied, setCopied] = useState('');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const updateColorFormats = (hexColor: string) => {
    setColor(hexColor);
    setHex(hexColor);

    const rgb = hexToRgb(hexColor);
    if (rgb) {
      setRgb(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);

      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setHsl(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    }

    trackEvent('tool_completed', {
      tool_name: toolData.name,
      processing_time_ms: 0,
      success: true,
    });
  };

  const handleCopy = async (value: string, format: string) => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(format);
      setTimeout(() => setCopied(''), 2000);

      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: `copy_${format}`,
      });
    }
  };

  const handleHexInput = (value: string) => {
    const hexValue = value.startsWith('#') ? value : `#${value}`;
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
      updateColorFormats(hexValue);
    } else {
      setHex(hexValue);
    }
  };

  useEffect(() => {
    updateColorFormats(color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Color Picker */}
      <div className="text-center">
        <label className="text-purple-300 font-semibold mb-4 block">SELECT COLOR</label>
        <div className="inline-block">
          <input
            type="color"
            value={color}
            onChange={(e) => updateColorFormats(e.target.value)}
            className="w-64 h-64 border-4 border-slate-700 rounded-2xl cursor-pointer"
            style={{ background: color }}
          />
        </div>
      </div>

      {/* Color Formats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HEX */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <label className="text-slate-400 text-sm mb-2 block">HEX</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={hex}
              onChange={(e) => handleHexInput(e.target.value)}
              className="flex-1 bg-slate-800 border-slate-600 font-mono"
            />
            <Button
              variant="secondary"
              onClick={() => handleCopy(hex, 'hex')}
              className="whitespace-nowrap"
            >
              {copied === 'hex' ? '✓' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* RGB */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <label className="text-slate-400 text-sm mb-2 block">RGB</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={rgb}
              readOnly
              className="flex-1 bg-slate-800 border-slate-600 font-mono"
            />
            <Button
              variant="secondary"
              onClick={() => handleCopy(rgb, 'rgb')}
              className="whitespace-nowrap"
            >
              {copied === 'rgb' ? '✓' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* HSL */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <label className="text-slate-400 text-sm mb-2 block">HSL</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={hsl}
              readOnly
              className="flex-1 bg-slate-800 border-slate-600 font-mono"
            />
            <Button
              variant="secondary"
              onClick={() => handleCopy(hsl, 'hsl')}
              className="whitespace-nowrap"
            >
              {copied === 'hsl' ? '✓' : 'Copy'}
            </Button>
          </div>
        </div>
      </div>

      {/* Color Preview */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <label className="text-purple-300 font-semibold mb-4 block">PREVIEW</label>
        <div className="grid grid-cols-2 gap-4">
          {/* Light Background */}
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-sm text-slate-600 mb-3">On Light Background</p>
            <div
              className="w-full h-24 rounded-lg"
              style={{ backgroundColor: color }}
            />
            <p
              className="mt-3 text-lg font-semibold"
              style={{ color: color }}
            >
              Sample Text
            </p>
          </div>

          {/* Dark Background */}
          <div className="bg-slate-950 rounded-lg p-6 text-center">
            <p className="text-sm text-slate-400 mb-3">On Dark Background</p>
            <div
              className="w-full h-24 rounded-lg"
              style={{ backgroundColor: color }}
            />
            <p
              className="mt-3 text-lg font-semibold"
              style={{ color: color }}
            >
              Sample Text
            </p>
          </div>
        </div>
      </div>

      {/* Preset Colors */}
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
        <label className="text-purple-300 font-semibold mb-4 block">POPULAR COLORS</label>
        <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
          {[
            '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
            '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
            '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b',
          ].map((presetColor) => (
            <button
              key={presetColor}
              onClick={() => updateColorFormats(presetColor)}
              className="w-full aspect-square rounded-lg border-2 border-slate-700 hover:border-white transition-colors"
              style={{ backgroundColor: presetColor }}
              title={presetColor}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ Color Formats</h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li><strong className="text-white">HEX:</strong> Most common format in CSS (#RRGGBB)</li>
          <li><strong className="text-white">RGB:</strong> Red, Green, Blue values (0-255)</li>
          <li><strong className="text-white">HSL:</strong> Hue, Saturation, Lightness (intuitive for adjustments)</li>
        </ul>
      </div>
    </div>
  );
}
