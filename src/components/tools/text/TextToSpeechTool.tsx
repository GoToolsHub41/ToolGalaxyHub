'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import type { Tool } from '@/types/tool';

interface TextToSpeechToolProps {
  toolData: Tool;
}

export function TextToSpeechTool({ toolData }: TextToSpeechToolProps) {
  const [text, setText] = useState('Hello! Welcome to ToolGalaxyHub. This is a text to speech demonstration.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if speech synthesis is supported
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setIsSupported(false);
      setError('Text-to-Speech is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Load voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        // Try to select English voice by default
        const englishVoice = availableVoices.findIndex(v => v.lang.startsWith('en'));
        if (englishVoice !== -1) {
          setSelectedVoice(englishVoice);
        }
      }
    };

    loadVoices();

    // Chrome loads voices asynchronously
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      // Cleanup: stop any ongoing speech
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeak = () => {
    if (!isSupported) return;

    if (!text.trim()) {
      setError('Please enter some text to convert to speech');
      return;
    }

    setError('');

    try {
      trackEvent('tool_action_clicked', {
        tool_name: toolData.name,
        action_name: 'speak',
      });

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Set voice
      if (voices[selectedVoice]) {
        utterance.voice = voices[selectedVoice];
      }

      // Set parameters
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      // Event handlers
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);

        trackEvent('tool_completed', {
          tool_name: toolData.name,
          processing_time_ms: 0,
          success: true,
        });
      };

      utterance.onerror = (event) => {
        setError(`Speech error: ${event.error}`);
        setIsPlaying(false);
        setIsPaused(false);

        trackEvent('tool_error', {
          tool_name: toolData.name,
          error_type: 'SpeechError',
          error_message: event.error,
        });
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div>
        <label className="text-purple-300 font-semibold mb-2 block">TEXT TO SPEAK</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="min-h-[200px] bg-slate-800 border-slate-600 text-white text-lg"
          disabled={isPlaying}
        />
        <div className="mt-2 text-sm text-slate-400">
          {text.length} characters
        </div>
      </div>

      {/* Voice Selection */}
      {isSupported && voices.length > 0 && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <label className="text-purple-300 font-semibold mb-2 block">Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2"
            disabled={isPlaying}
          >
            {voices.map((voice, index) => (
              <option key={index} value={index}>
                {voice.name} ({voice.lang}) {voice.default ? '- Default' : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Voice Controls */}
      {isSupported && (
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-4">
          <h3 className="text-purple-300 font-semibold">Voice Controls</h3>

          {/* Speed */}
          <div>
            <label className="text-slate-300 mb-2 block text-sm">
              Speed: {rate.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full"
              disabled={isPlaying}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Pitch */}
          <div>
            <label className="text-slate-300 mb-2 block text-sm">
              Pitch: {pitch.toFixed(1)}
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full"
              disabled={isPlaying}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Lower</span>
              <span>Higher</span>
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="text-slate-300 mb-2 block text-sm">
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>Quiet</span>
              <span>Loud</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isSupported && (
        <div className="flex gap-3 flex-wrap">
          {!isPlaying ? (
            <Button onClick={handleSpeak} disabled={!text.trim()}>
              Speak
            </Button>
          ) : (
            <>
              {!isPaused ? (
                <Button variant="secondary" onClick={handlePause}>
                  Pause
                </Button>
              ) : (
                <Button onClick={handleResume}>
                  Resume
                </Button>
              )}
              <Button variant="secondary" onClick={handleStop}>
                Stop
              </Button>
            </>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Playing Indicator */}
      {isPlaying && !isPaused && (
        <div className="bg-green-900/20 border border-green-500 text-green-400 p-4 rounded-lg flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-1 h-6 bg-green-400 animate-pulse"></div>
            <div className="w-1 h-6 bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-6 bg-green-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span>Speaking...</span>
        </div>
      )}

      {isPaused && (
        <div className="bg-yellow-900/20 border border-yellow-500 text-yellow-400 p-4 rounded-lg">
          ⏸️ Paused
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ Text-to-Speech</h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Convert any text into spoken audio using your browser's speech synthesis</li>
          <li>Choose from multiple voices in different languages</li>
          <li>Adjust speed, pitch, and volume to your preference</li>
          <li>Pause and resume playback anytime</li>
          <li>All processing happens in your browser - no data sent to servers</li>
        </ul>
      </div>
    </div>
  );
}
