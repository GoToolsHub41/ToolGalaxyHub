'use client';

import { useState, useRef, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Tool } from '@/types/tool';

interface BarcodeGeneratorToolProps {
  toolData: Tool;
}

type BarcodeFormat = 'CODE128' | 'EAN13' | 'EAN8' | 'UPC' | 'CODE39';

export function BarcodeGeneratorTool({ toolData }: BarcodeGeneratorToolProps) {
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState<BarcodeFormat>('CODE128');
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const validateInput = (value: string, barcodeFormat: BarcodeFormat): boolean => {
    switch (barcodeFormat) {
      case 'EAN13':
        return /^\d{13}$/.test(value);
      case 'EAN8':
        return /^\d{8}$/.test(value);
      case 'UPC':
        return /^\d{12}$/.test(value);
      case 'CODE39':
        return /^[0-9A-Z\-. $/+%]+$/.test(value);
      case 'CODE128':
        return value.length > 0;
      default:
        return false;
    }
  };

  const getFormatDescription = (barcodeFormat: BarcodeFormat): string => {
    switch (barcodeFormat) {
      case 'EAN13':
        return '13 digits (e.g., 1234567890123)';
      case 'EAN8':
        return '8 digits (e.g., 12345678)';
      case 'UPC':
        return '12 digits (e.g., 123456789012)';
      case 'CODE39':
        return 'Alphanumeric (A-Z, 0-9, -. $/+%)';
      case 'CODE128':
        return 'Any text';
      default:
        return '';
    }
  };

  const generateBarcode = async () => {
    if (!text) {
      setError('Please enter text or numbers');
      return;
    }

    if (!validateInput(text, format)) {
      setError(`Invalid format. ${format} requires: ${getFormatDescription(format)}`);
      return;
    }

    const startTime = Date.now();
    setIsProcessing(true);
    setError('');

    try {
      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'generate',
      });

      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas not found');

      const JsBarcode = (await import('jsbarcode')).default;

      // Generate barcode on canvas
      JsBarcode(canvas, text, {
        format: format,
        width: width,
        height: height,
        displayValue: displayValue,
        margin: 10,
      });

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL('image/png');
      setBarcodeUrl(dataUrl);

      trackEvent('tool_completed', {
        tool_name: toolData.name,
        processing_time_ms: Date.now() - startTime,
        success: true,
      });
    } catch (err: any) {
      setError(`Error generating barcode: ${err.message}`);

      trackEvent('tool_error', {
        tool_name: toolData.name,
        error_type: 'GenerationError',
        error_message: err.message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!barcodeUrl) return;

    const a = document.createElement('a');
    a.href = barcodeUrl;
    a.download = `barcode-${text}.png`;
    a.click();

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: 'png',
      file_size_kb: Math.round(barcodeUrl.length * 0.75 / 1024), // Rough estimate
    });
  };

  const handleFormatChange = (newFormat: BarcodeFormat) => {
    setFormat(newFormat);
    setBarcodeUrl('');
    setError('');

    // Set appropriate default values for each format
    switch (newFormat) {
      case 'EAN13':
        setText('1234567890123');
        break;
      case 'EAN8':
        setText('12345678');
        break;
      case 'UPC':
        setText('123456789012');
        break;
      case 'CODE39':
        setText('BARCODE123');
        break;
      case 'CODE128':
        setText('Hello World');
        break;
    }
  };

  // Auto-generate on mount
  useEffect(() => {
    generateBarcode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">BARCODE TEXT</label>
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or numbers"
          className="bg-slate-800 border-slate-600 text-white text-lg"
        />
      </div>

      {/* Format Selection */}
      <div>
        <label className="text-purple-300 font-semibold mb-3 block">BARCODE FORMAT</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {(['CODE128', 'EAN13', 'EAN8', 'UPC', 'CODE39'] as BarcodeFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleFormatChange(fmt)}
              className={`px-4 py-3 rounded-lg transition-all ${
                format === fmt
                  ? 'bg-violet-nebula text-white border-2 border-violet-nebula'
                  : 'bg-slate-800 text-slate-300 border border-slate-600 hover:border-violet-nebula'
              }`}
            >
              <div className="font-semibold">{fmt}</div>
              <div className="text-xs opacity-75 mt-1">{getFormatDescription(fmt)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Options */}
      <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-4">
        <h3 className="text-purple-300 font-semibold">Options</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-slate-300 mb-2 block text-sm">Bar Width</label>
            <input
              type="range"
              min="1"
              max="5"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-slate-400">{width}px</span>
          </div>

          <div>
            <label className="text-slate-300 mb-2 block text-sm">Bar Height</label>
            <input
              type="range"
              min="50"
              max="200"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-slate-400">{height}px</span>
          </div>
        </div>

        <label className="flex items-center gap-2 text-white cursor-pointer">
          <input
            type="checkbox"
            checked={displayValue}
            onChange={(e) => setDisplayValue(e.target.checked)}
            className="w-4 h-4"
          />
          Display text below barcode
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={generateBarcode} disabled={isProcessing || !text}>
          {isProcessing ? 'Generating...' : 'Generate Barcode'}
        </Button>
        {barcodeUrl && (
          <Button variant="secondary" onClick={handleDownload}>
            Download Barcode
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Hidden canvas for generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Barcode Display */}
      {barcodeUrl && (
        <div className="bg-white rounded-lg p-8 text-center">
          <img
            src={barcodeUrl}
            alt="Generated Barcode"
            className="mx-auto max-w-full h-auto"
          />
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ Barcode Formats</h3>
        <ul className="text-sm text-slate-300 space-y-2">
          <li><strong className="text-white">CODE128:</strong> Most versatile, supports all ASCII characters</li>
          <li><strong className="text-white">EAN13:</strong> International product barcodes (13 digits)</li>
          <li><strong className="text-white">EAN8:</strong> Compact version for small products (8 digits)</li>
          <li><strong className="text-white">UPC:</strong> North American product barcodes (12 digits)</li>
          <li><strong className="text-white">CODE39:</strong> Alphanumeric, commonly used in logistics</li>
        </ul>
      </div>
    </div>
  );
}
