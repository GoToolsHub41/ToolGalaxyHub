'use client';

import { useState, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Tool } from '@/types/tool';

interface ImageResizerToolProps {
  toolData: Tool;
}

export function ImageResizerTool({ toolData }: ImageResizerToolProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [quality, setQuality] = useState(90);
  const [resizedImage, setResizedImage] = useState<string>('');
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));

  const handleFileUpload = (file: File) => {
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, GIF, WEBP)');
      return;
    }

    setUploadedFile(file);
    setError('');
    setResizedImage('');
    setResizedBlob(null);

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);

      // Load image to get dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (newWidth: number) => {
    if (newWidth < 1) return;
    setWidth(newWidth);
    if (maintainRatio && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    if (newHeight < 1) return;
    setHeight(newHeight);
    if (maintainRatio && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = async () => {
    if (!uploadedImage || width <= 0 || height <= 0) {
      setError('Please provide valid dimensions');
      return;
    }

    const startTime = Date.now();
    setIsProcessing(true);
    setError('');

    try {
      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'resize',
      });

      // Create image element
      const img = new Image();
      img.src = uploadedImage;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Set canvas dimensions
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas with new dimensions
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Cannot get canvas context');

      ctx.drawImage(img, 0, 0, width, height);

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Error creating image blob');
            setIsProcessing(false);
            return;
          }

          setResizedBlob(blob);
          setResizedImage(URL.createObjectURL(blob));

          trackEvent('tool_completed', {
            tool_name: toolData.name,
            processing_time_ms: Date.now() - startTime,
            success: true,
          });
          setIsProcessing(false);
        },
        uploadedFile?.type || 'image/jpeg',
        quality / 100
      );
    } catch (err: any) {
      setError(`Error resizing image: ${err.message}`);
      setIsProcessing(false);

      trackEvent('tool_error', {
        tool_name: toolData.name,
        error_type: err.name || 'Error',
        error_message: err.message,
      });
    }
  };

  const handleDownload = () => {
    if (!resizedBlob) return;

    const url = URL.createObjectURL(resizedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resized-${uploadedFile?.name || 'image.jpg'}`;
    a.click();
    URL.revokeObjectURL(url);

    trackEvent('tool_download', {
      tool_name: toolData.name,
      file_type: uploadedFile?.type.split('/')[1] || 'image',
      file_size_kb: Math.round(resizedBlob.size / 1024),
    });
  };

  const handleReset = () => {
    setUploadedFile(null);
    setUploadedImage('');
    setResizedImage('');
    setResizedBlob(null);
    setError('');
    setWidth(800);
    setHeight(600);
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      {!uploadedImage && (
        <FileUpload
          onFileSelect={handleFileUpload}
          accept="image/*"
          maxSize={10 * 1024 * 1024}
          label="Upload Image"
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Original Image Preview */}
      {uploadedImage && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-purple-300 font-semibold">Original Image</h3>
            <Button variant="secondary" onClick={handleReset} className="text-sm">
              Upload Different Image
            </Button>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <img
              src={uploadedImage}
              alt="Original"
              className="max-w-full h-auto max-h-96 mx-auto rounded"
            />
            <p className="text-sm text-slate-400 mt-3 text-center">
              Original: {originalDimensions.width} × {originalDimensions.height} px
              ({Math.round((uploadedFile?.size || 0) / 1024)} KB)
            </p>
          </div>
        </div>
      )}

      {/* Dimension Inputs */}
      {uploadedImage && (
        <div>
          <h3 className="text-purple-300 font-semibold mb-3">New Dimensions</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-slate-300 mb-2 block text-sm">Width (px)</label>
              <Input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                min="1"
                className="bg-slate-800 border-slate-600"
              />
            </div>
            <div>
              <label className="text-slate-300 mb-2 block text-sm">Height (px)</label>
              <Input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                min="1"
                className="bg-slate-800 border-slate-600"
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-white cursor-pointer">
              <input
                type="checkbox"
                checked={maintainRatio}
                onChange={(e) => setMaintainRatio(e.target.checked)}
                className="w-4 h-4 accent-violet-nebula"
              />
              <span>Maintain aspect ratio</span>
            </label>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-300 text-sm">Image Quality</label>
                <span className="text-white font-semibold">{quality}%</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {uploadedImage && (
        <div className="flex gap-3 flex-wrap">
          <Button onClick={handleResize} disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner />
                Resizing...
              </span>
            ) : (
              'Resize Image'
            )}
          </Button>
          {resizedImage && (
            <Button variant="secondary" onClick={handleDownload}>
              Download Resized Image
            </Button>
          )}
        </div>
      )}

      {/* Resized Image Preview */}
      {resizedImage && (
        <div>
          <h3 className="text-purple-300 font-semibold mb-2">Resized Image</h3>
          <div className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-4">
            <img
              src={resizedImage}
              alt="Resized"
              className="max-w-full h-auto max-h-96 mx-auto rounded"
            />
            <div className="mt-3 text-center">
              <p className="text-sm text-slate-300">
                Resized: {width} × {height} px
              </p>
              <p className="text-sm text-slate-400">
                File size: {Math.round((resizedBlob?.size || 0) / 1024)} KB
              </p>
              {uploadedFile && resizedBlob && (
                <p className="text-sm text-green-400 mt-1">
                  Size reduction: {((1 - resizedBlob.size / uploadedFile.size) * 100).toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
