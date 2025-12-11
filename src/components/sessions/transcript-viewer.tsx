import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { SessionMessage } from '@/lib/definitions';
import { format } from 'date-fns';
import { Bot, User, Wrench } from 'lucide-react';

interface TranscriptViewerProps {
  messages: SessionMessage[];
}

export function TranscriptViewer({ messages }: TranscriptViewerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
        <CardDescription>Full log of the conversation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {messages.length > 0 ? messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex items-start gap-4', {
              'justify-start': message.sender === 'user',
              'justify-end': message.sender === 'agent',
            })}
          >
            {message.sender === 'user' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground"><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn('flex flex-col gap-1', {
                'items-start': message.sender === 'user',
                'items-end': message.sender === 'agent',
              })}
            >
              <div
                className={cn('max-w-md rounded-lg p-3 text-sm', {
                  'bg-primary text-primary-foreground rounded-bl-none': message.sender === 'user',
                  'bg-muted rounded-br-none': message.sender === 'agent',
                })}
              >
                <p>{message.text}</p>
                {message.tool_used && (
                    <div className="mt-2 flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 bg-black/5 dark:bg-white/5 p-2 text-xs text-muted-foreground">
                        <Wrench className="h-3 w-3" />
                        <span>Tool Used: <code className="font-semibold">{message.tool_used}</code></span>
                    </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(message.created_at), 'h:mm a')}
                {message.tokens && ` · ${message.tokens} tokens`}
              </div>
            </div>

            {message.sender === 'agent' && (
              <Avatar className="h-8 w-8">
                <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            )}
          </div>
        )) : (
            <div className="text-center text-muted-foreground py-12">
                <p>No messages in this session yet.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
