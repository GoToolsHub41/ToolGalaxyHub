'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { copyToClipboard } from '@/lib/utils';
import type { Tool } from '@/types/tool';

interface MetaTagGeneratorToolProps {
  toolData: Tool;
}

export function MetaTagGeneratorTool({ toolData }: MetaTagGeneratorToolProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    let metaTags = '';

    // Basic Meta Tags
    if (title) {
      metaTags += `<title>${title}</title>\n`;
      metaTags += `<meta name="title" content="${title}">\n`;
    }
    if (description) {
      metaTags += `<meta name="description" content="${description}">\n`;
    }
    if (keywords) {
      metaTags += `<meta name="keywords" content="${keywords}">\n`;
    }
    if (author) {
      metaTags += `<meta name="author" content="${author}">\n`;
    }

    metaTags += `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
    metaTags += `<meta charset="UTF-8">\n\n`;

    // Open Graph Meta Tags
    metaTags += `<!-- Open Graph / Facebook -->\n`;
    metaTags += `<meta property="og:type" content="website">\n`;
    if (url) {
      metaTags += `<meta property="og:url" content="${url}">\n`;
    }
    if (title) {
      metaTags += `<meta property="og:title" content="${title}">\n`;
    }
    if (description) {
      metaTags += `<meta property="og:description" content="${description}">\n`;
    }
    if (image) {
      metaTags += `<meta property="og:image" content="${image}">\n\n`;
    }

    // Twitter Card Meta Tags
    metaTags += `<!-- Twitter -->\n`;
    metaTags += `<meta property="twitter:card" content="summary_large_image">\n`;
    if (url) {
      metaTags += `<meta property="twitter:url" content="${url}">\n`;
    }
    if (title) {
      metaTags += `<meta property="twitter:title" content="${title}">\n`;
    }
    if (description) {
      metaTags += `<meta property="twitter:description" content="${description}">\n`;
    }
    if (image) {
      metaTags += `<meta property="twitter:image" content="${image}">\n`;
    }
    if (twitterHandle) {
      metaTags += `<meta name="twitter:site" content="@${twitterHandle.replace('@', '')}">\n`;
      metaTags += `<meta name="twitter:creator" content="@${twitterHandle.replace('@', '')}">\n`;
    }

    setOutput(metaTags);

    trackEvent('tool_action_clicked', {
      tool_name: toolData.name,
      action_name: 'generate',
    });

    trackEvent('tool_completed', {
      tool_name: toolData.name,
      processing_time_ms: 0,
      success: true,
    });
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
    setAuthor('');
    setUrl('');
    setImage('');
    setTwitterHandle('');
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="space-y-4">
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">Title *</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Your page title (50-60 characters)"
            className="bg-slate-800 border-slate-600"
          />
          <p className="text-xs text-slate-400 mt-1">{title.length} / 60 characters</p>
        </div>

        <div>
          <label className="text-purple-300 font-semibold mb-2 block">Description *</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Your page description (150-160 characters)"
            className="min-h-[100px] bg-slate-800 border-slate-600 text-white"
          />
          <p className="text-xs text-slate-400 mt-1">{description.length} / 160 characters</p>
        </div>

        <div>
          <label className="text-purple-300 font-semibold mb-2 block">Keywords</label>
          <Input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="keyword1, keyword2, keyword3"
            className="bg-slate-800 border-slate-600"
          />
        </div>

        <div>
          <label className="text-purple-300 font-semibold mb-2 block">Author</label>
          <Input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name or company name"
            className="bg-slate-800 border-slate-600"
          />
        </div>

        <div>
          <label className="text-purple-300 font-semibold mb-2 block">URL</label>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="bg-slate-800 border-slate-600"
          />
        </div>

        <div>
          <label className="text-purple-300 font-semibold mb-2 block">Image URL (OG Image)</label>
          <Input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://example.com/og-image.jpg (1200x630px recommended)"
            className="bg-slate-800 border-slate-600"
          />
        </div>

        <div>
          <label className="text-purple-300 font-semibold mb-2 block">Twitter Handle</label>
          <Input
            type="text"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
            placeholder="@username"
            className="bg-slate-800 border-slate-600"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={handleGenerate} disabled={!title || !description}>
          Generate Meta Tags
        </Button>
        <Button variant="secondary" onClick={handleCopy} disabled={!output}>
          {copied ? 'Copied!' : 'Copy Tags'}
        </Button>
        <Button variant="secondary" onClick={handleClear}>
          Clear All
        </Button>
      </div>

      {/* Output Section */}
      {output && (
        <div>
          <label className="text-purple-300 font-semibold mb-2 block">GENERATED META TAGS</label>
          <div className="bg-slate-800 border-2 border-cyan-500 rounded-lg p-4 text-white font-mono text-sm overflow-auto max-h-96">
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">ℹ️ Meta Tags Best Practices</h3>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li><strong>Title:</strong> Keep between 50-60 characters for optimal display</li>
          <li><strong>Description:</strong> Keep between 150-160 characters</li>
          <li><strong>OG Image:</strong> Use 1200x630px for best results on social media</li>
          <li><strong>Keywords:</strong> While less important today, still useful for some search engines</li>
          <li>Place these tags in the {`<head>`} section of your HTML</li>
        </ul>
      </div>
    </div>
  );
}
