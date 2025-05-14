// app/page.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Copy } from 'lucide-react';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [genre, setGenre] = useState('Educational');
  const [script, setScript] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    setScript('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: topic, genre }),
      });
      const data = await res.json();
      setScript(data.result || data.error || 'Something went wrong');
    } catch (err) {
      setScript('Error generating script');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
  };

  return (
    <main className='max-w-2xl mx-auto py-10 px-4 space-y-4'>
      <h1 className='text-2xl font-bold'>🎬 YouTube Script Generator</h1>

      <Input
        placeholder='Enter your video topic...'
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <Select defaultValue={genre} onValueChange={setGenre}>
        <SelectTrigger>
          <SelectValue placeholder='Select genre' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='Educational'>Educational</SelectItem>
          <SelectItem value='Motivational'>Motivational</SelectItem>
          <SelectItem value='Tech Review'>Tech Review</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate'}
      </Button>

      {script && (
        <div className='relative'>
          <Textarea readOnly value={script} rows={15} className='mt-4' />
          <Button
            variant='outline'
            className='absolute top-2 right-2'
            size='sm'
            onClick={handleCopy}
          >
            <Copy size={16} className='mr-1' /> Copy
          </Button>
        </div>
      )}
    </main>
  );
}
