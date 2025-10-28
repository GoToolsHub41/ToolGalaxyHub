'use client';

import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface PasswordGeneratorToolProps {
  toolData: Tool;
}

export function PasswordGeneratorTool({ toolData }: PasswordGeneratorToolProps) {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState('');
  const [entropy, setEntropy] = useState(0);
  const [copied, setCopied] = useState(false);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [showMultiple, setShowMultiple] = useState(false);

  const generatePassword = () => {
    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate',
    });

    let charset = '';

    // Build character set based on options
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Exclude similar characters if requested
    if (excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '');
    }

    // Exclude ambiguous characters if requested
    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()\\/'"<>`]/g, '');
    }

    if (charset.length === 0) {
      setPassword('Please select at least one character type');
      return;
    }

    // Generate cryptographically secure random password
    const passwordArray = new Uint8Array(length);
    crypto.getRandomValues(passwordArray);

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      generatedPassword += charset[passwordArray[i] % charset.length];
    }

    setPassword(generatedPassword);

    // Calculate strength and entropy
    const calculatedEntropy = length * Math.log2(charset.length);
    const calculatedStrength = calculateStrength(calculatedEntropy);

    setEntropy(Math.round(calculatedEntropy));
    setStrength(calculatedStrength);

    trackEvent('tool_completed', {
      tool_name: toolData.name,
      processing_time_ms: 0,
      success: true,
    });
  };

  const generateMultiple = () => {
    const multiplePasswords: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Generate password logic (same as generatePassword but without state updates)
      let charset = '';
      if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (includeNumbers) charset += '0123456789';
      if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

      if (excludeSimilar) {
        charset = charset.replace(/[il1Lo0O]/g, '');
      }
      if (excludeAmbiguous) {
        charset = charset.replace(/[{}[\]()\\/'"<>`]/g, '');
      }

      if (charset.length === 0) continue;

      const passwordArray = new Uint8Array(length);
      crypto.getRandomValues(passwordArray);

      let pwd = '';
      for (let j = 0; j < length; j++) {
        pwd += charset[passwordArray[j] % charset.length];
      }
      multiplePasswords.push(pwd);
    }

    setPasswords(multiplePasswords);
    setShowMultiple(true);

    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate_multiple',
    });
  };

  const calculateStrength = (calculatedEntropy: number): string => {
    if (calculatedEntropy < 40) return 'Weak';
    if (calculatedEntropy < 60) return 'Medium';
    if (calculatedEntropy < 80) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = (str: string) => {
    switch (str) {
      case 'Very Strong':
        return 'text-green-400';
      case 'Strong':
        return 'text-cyan-400';
      case 'Medium':
        return 'text-yellow-400';
      default:
        return 'text-red-400';
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(password);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyMultiple = async (pwd: string) => {
    await copyToClipboard(pwd);
  };

  // Generate password on mount
  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      {/* Password Display */}
      <div className="bg-slate-800 border-2 border-cyan-500 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-400">Generated Password</span>
          <Button variant="secondary" onClick={handleCopy} className="text-sm py-1 px-3">
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        <p className="text-2xl md:text-3xl font-mono text-white break-all mb-4 select-all">
          {password}
        </p>
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-slate-400">Strength: </span>
            <span className={`font-semibold ${getStrengthColor(strength)}`}>
              {strength}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Entropy: </span>
            <span className="text-white font-semibold">{entropy} bits</span>
          </div>
        </div>
      </div>

      {/* Length Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-purple-300 font-semibold">Password Length</label>
          <span className="text-white font-bold text-lg">{length}</span>
        </div>
        <input
          type="range"
          min="8"
          max="128"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>8</span>
          <span>128</span>
        </div>
      </div>

      {/* Character Type Checkboxes */}
      <div>
        <label className="text-purple-300 font-semibold mb-3 block">Character Types</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-white cursor-pointer hover:text-cyan-star transition-colors">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-4 h-4 accent-violet-nebula"
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>
          <label className="flex items-center gap-3 text-white cursor-pointer hover:text-cyan-star transition-colors">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="w-4 h-4 accent-violet-nebula"
            />
            <span>Lowercase Letters (a-z)</span>
          </label>
          <label className="flex items-center gap-3 text-white cursor-pointer hover:text-cyan-star transition-colors">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 accent-violet-nebula"
            />
            <span>Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-3 text-white cursor-pointer hover:text-cyan-star transition-colors">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 accent-violet-nebula"
            />
            <span>Symbols (!@#$%^&*)</span>
          </label>
        </div>
      </div>

      {/* Additional Options */}
      <div>
        <label className="text-purple-300 font-semibold mb-3 block">Additional Options</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-white cursor-pointer hover:text-cyan-star transition-colors">
            <input
              type="checkbox"
              checked={excludeSimilar}
              onChange={(e) => setExcludeSimilar(e.target.checked)}
              className="w-4 h-4 accent-cyan-star"
            />
            <span className="text-sm">Exclude Similar Characters (i, l, 1, L, o, 0, O)</span>
          </label>
          <label className="flex items-center gap-3 text-white cursor-pointer hover:text-cyan-star transition-colors">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="w-4 h-4 accent-cyan-star"
            />
            <span className="text-sm">Exclude Ambiguous Characters ({`{} [] () / \\ ' " < > \``})</span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={generatePassword}>
          Generate New Password
        </Button>
        <Button variant="secondary" onClick={generateMultiple}>
          Generate 10 Passwords
        </Button>
      </div>

      {/* Multiple Passwords Display */}
      {showMultiple && passwords.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Generated Passwords</h3>
          <div className="space-y-2">
            {passwords.map((pwd, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-slate-900 p-3 rounded-lg font-mono text-sm"
              >
                <span className="text-white break-all flex-1 mr-3">{pwd}</span>
                <button
                  onClick={() => handleCopyMultiple(pwd)}
                  className="text-cyan-star hover:text-cyan-400 transition-colors text-xs whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">🔒 Security Tips</h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Use passwords with at least 12-16 characters for better security</li>
          <li>Never reuse passwords across different websites</li>
          <li>Store passwords securely in a password manager</li>
          <li>Enable two-factor authentication (2FA) whenever possible</li>
          <li>This tool generates passwords entirely in your browser - they are never sent to any server</li>
        </ul>
      </div>
    </div>
  );
}
