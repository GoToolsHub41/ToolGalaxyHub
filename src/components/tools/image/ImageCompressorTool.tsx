'use client';

import { useState, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import type { Tool } from '@/types/tool';

interface ImageCompressorToolProps {
  toolData: Tool;
}

export function ImageCompressorTool({ toolData }: ImageCompressorToolProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [compressedImage, setCompressedImage] = useState<string>('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const handleFileUpload = (file: File) => {
    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds 20MB limit');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    setUploadedFile(file);
    setOriginalSize(file.size);
    setError('');
    setCompressedImage('');
    setCompressedBlob(null);

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCompress = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    const startTime = Date.now();
    setIsProcessing(true);
    setError('');

    try {
      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'compress',
      });

      // Create image element
      const img = new Image();
      img.src = uploadedImage;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Set canvas dimensions to original image size
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image on canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      ctx.drawImage(img, 0, 0);

      // Convert canvas to blob with compression
      const mimeType = uploadedFile?.type === 'image/png' ? 'image/png' : 'image/jpeg';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Error compressing image');
            setIsProcessing(false);
            return;
          }

          setCompressedBlob(blob);
          setCompressedSize(blob.size);
          setCompressedImage(URL.createObjectURL(blob));

          trackEvent('tool_completed', {
            tool_name: toolData.name,
            processing_time_ms: Date.now() - startTime,
            success: true,
          });

          setIsProcessing(false);
        },
        mimeType,
        quality / 100
      );
    } catch (err: any) {
      setError(`Error compressing image: ${err.message}`);

      trackEvent('tool_error', {
        tool_name: toolData.name,
        error_type: err.name,
        error_message: err.message,
      });

      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !uploadedFile) return;

    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    const extension = uploadedFile.type === 'image/png' ? 'png' : 'jpg';
    a.download = `compressed-${uploadedFile.name.replace(/\.[^.]+$/, '')}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: uploadedFile.type.split('/')[1],
      file_size_kb: Math.round(compressedBlob.size / 1024),
    });
  };

  const handleReset = () => {
    setUploadedFile(null);
    setUploadedImage('');
    setCompressedImage('');
    setCompressedBlob(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setError('');
    setQuality(80);
  };

  const calculateReduction = () => {
    if (originalSize === 0 || compressedSize === 0) return 0;
    return Math.round(((originalSize - compressedSize) / originalSize) * 100);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      {!uploadedImage && (
        <FileUpload
          onFileSelect={handleFileUpload}
          accept="image/*"
          maxSize={20 * 1024 * 1024}
          label="Upload Image to Compress"
        />
      )}

      {/* Original Image Preview */}
      {uploadedImage && !compressedImage && (
        <div>
          <h3 className="text-purple-300 font-semibold mb-2">Original Image</h3>
          <img
            src={uploadedImage}
            alt="Original"
            className="max-w-full h-auto border border-slate-600 rounded-lg"
          />
          <p className="text-sm text-slate-400 mt-2">
            File size: {formatFileSize(originalSize)}
          </p>
        </div>
      )}

      {/* Quality Slider */}
      {uploadedImage && !compressedImage && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <label className="text-purple-300 mb-2 block">
            Compression Quality: {quality}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Lower size</span>
            <span>Higher quality</span>
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Lower quality = smaller file size. Recommended: 80-90 for web use.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      {uploadedImage && !compressedImage && (
        <div className="flex gap-3">
          <Button onClick={handleCompress} disabled={isProcessing}>
            {isProcessing ? 'Compressing...' : 'Compress Image'}
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Upload Different Image
          </Button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Compressed Result */}
      {compressedImage && (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
            <h3 className="text-green-400 font-semibold mb-2">✓ Compression Complete!</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Original Size:</p>
                <p className="text-white font-bold">{formatFileSize(originalSize)}</p>
              </div>
              <div>
                <p className="text-slate-400">Compressed Size:</p>
                <p className="text-white font-bold">{formatFileSize(compressedSize)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-500/30">
              <p className="text-green-300 font-semibold text-lg">
                Reduced by {calculateReduction()}%
              </p>
            </div>
          </div>

          {/* Compressed Image Preview */}
          <div>
            <h3 className="text-purple-300 font-semibold mb-2">Compressed Image</h3>
            <img
              src={compressedImage}
              alt="Compressed"
              className="max-w-full h-auto border-2 border-cyan-500 rounded-lg"
            />
          </div>

          {/* Download and Reset Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleDownload}>
              Download Compressed Image
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Compress Another Image
            </Button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ Image Compression</h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Reduce image file size while maintaining visual quality</li>
          <li>Perfect for web optimization and faster page loads</li>
          <li>Supports JPG, PNG, WebP formats</li>
          <li>All compression happens in your browser - your images never leave your device</li>
          <li>Recommended quality: 80-90% for best balance</li>
        </ul>
      </div>
    </div>
  );
}
