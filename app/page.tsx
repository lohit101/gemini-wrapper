"use client";

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { CornerDownLeft, Loader, Paperclip } from 'lucide-react';
import { MouseEvent, useState } from 'react';

// Define a type for a single chat message
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function Home() {
  // Loading states
  const [loading, setLoading] = useState(false);

  // Other states
  const [response, setResponse] = useState('');
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<ChatMessage[]>([]);

  const sendMessage = async () => {
    // Set loading state
    setLoading(true);

    // Update chat screen
    setHistory(
      [
        ...history,
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ]
    );

    // Make api call
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt, history: history }), // Send prompt in the request body
      });

      // retrieve data
      const data = await response.json();
      console.log(data);

      // sort data into components
      setResponse(data.response);
      setHistory(data.history);

      // reset loading state
      setPrompt('');
      setLoading(false);
    } catch (error) {
      // reset loading state
      setLoading(false);
      console.error('Error fetching response:', error);
    }
    // revalidate
  };

  return (
    <div className="relative flex flex-col gap-5 text-white w-full md:w-[60%] md:max-w-[60rem] h-[100dvh] md:max-h-[90dvh] md:h-[90dvh] overflow-y-scroll mx-auto p-3">
      {/* map history elements here */}
      {history.map((item, index) => (
        <div key={index} className={`flex w-3/4 ${item.role === 'user' ? 'self-end justify-end' : 'self-start justify-start'}`}>
          <p className={`py-1.5 px-4 rounded-2xl ${item.role === 'user' ? 'bg-blue-500 rounded-br-none' : 'bg-child rounded-bl-none'}`}>
            {item.parts[0].text}
          </p>
        </div>
      ))}
      {loading ? <Skeleton className="h-4 w-[250px] bg-child" /> : null }
      <div className="fixed left-0 md:left-auto bottom-0 flex flex-row gap-2 p-2 bg-black/50 backdrop-blur-md border-t border-white/10 w-full md:w-[60%] md:max-w-[60rem]">
        <Textarea className={`bg-parent border-white/10 rounded-lg ${loading ? 'pointer-events-none' : 'pointer-events-all'}`} placeholder="Type your message here." value={loading ? '' : prompt} onChange={(e) => setPrompt(e.target.value)} />
        <div className="flex flex-col gap-2">
          <Button disabled={loading} onClick={sendMessage} className='flex items-center justify-center bg-white hover:bg-zinc-300 border border-gray-300 rounded-lg h-10 w-10'>{loading ? <Loader className='text-black animate-spin duration-1000' /> : <CornerDownLeft className='text-black' />}</Button>
          <Button variant="secondary" disabled={loading} className='flex items-center justify-center bg-parent hover:bg-child border border-white/10 rounded-lg h-10 w-10'><Paperclip className='text-gray-400' /></Button>
        </div>
      </div>
    </div>
  );
}
