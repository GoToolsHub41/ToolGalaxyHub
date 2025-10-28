'use client';

import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { Tool } from '@/types/tool';

interface QrCodeGeneratorToolProps {
  toolData: Tool;
}

export function QrCodeGeneratorTool({ toolData }: QrCodeGeneratorToolProps) {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    if (!text.trim()) return;

    try {
      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'generate',
      });

      // Dynamically import QRCode library
      const QRCode = (await import('qrcode')).default;

      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });

      const dataUrl = canvas.toDataURL('image/png');
      setQrCodeUrl(dataUrl);

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: 0,
        success: true,
      });
    } catch (err: any) {
      console.error('QR Code generation error:', err);
      trackEvent('tool_error', {
        tool_name: toolData.name,
        error_type: err.name,
        error_message: err.message,
      });
    }
  };

  useEffect(() => {
    if (text.trim()) {
      generateQRCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, size, darkColor, lightColor]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = 'qrcode.png';
    a.click();

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: 'png',
      file_size_kb: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">TEXT OR URL</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or URL to generate QR code..."
          className="min-h-[150px] bg-slate-800 border-slate-600 text-white"
        />
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-purple-300 font-semibold mb-2 block text-sm">Size (px)</label>
          <Input
            type="number"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            min="128"
            max="1024"
            step="32"
            className="bg-slate-800 border-slate-600"
          />
        </div>

        <div>
          <label className="text-purple-300 font-semibold mb-2 block text-sm">Dark Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="w-12 h-10 bg-slate-800 border border-slate-600 rounded cursor-pointer"
            />
            <Input
              type="text"
              value={darkColor}
              onChange={(e) => setDarkColor(e.target.value)}
              className="flex-1 bg-slate-800 border-slate-600"
            />
          </div>
        </div>

        <div>
          <label className="text-purple-300 font-semibold mb-2 block text-sm">Light Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="w-12 h-10 bg-slate-800 border border-slate-600 rounded cursor-pointer"
            />
            <Input
              type="text"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              className="flex-1 bg-slate-800 border-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* QR Code Display */}
      {qrCodeUrl && (
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">GENERATED QR CODE</label>
          <div className="bg-white p-8 rounded-xl inline-block">
            <img src={qrCodeUrl} alt="QR Code" className="max-w-full" />
          </div>
          <div className="mt-4">
            <Button onClick={handleDownload}>
              Download QR Code
            </Button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ About QR Codes</h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>QR codes can store URLs, text, contact info, WiFi credentials, and more</li>
          <li>Scannable by any smartphone camera</li>
          <li>Perfect for business cards, marketing materials, and product labels</li>
          <li>Size recommendation: 256px minimum for printing</li>
        </ul>
      </div>
    </div>
  );
}
