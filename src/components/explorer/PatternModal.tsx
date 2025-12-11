import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bookmark, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export interface Pattern {
  id: string;
  title: string;
  description: string;
  content: string;
  codeSamples: {
    label: string;
    code: string;
  }[];
}
interface PatternModalProps {
  pattern: Pattern | null;
  isOpen: boolean;
  onClose: () => void;
  onBookmark: (pattern: Pattern) => void;
  isBookmarked: boolean;
}
export function PatternModal({ pattern, isOpen, onClose, onBookmark, isBookmarked }: PatternModalProps) {
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  if (!pattern) return null;
  const handleCopy = (code: string) => {
    copy(code);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  const handleBookmark = () => {
    onBookmark(pattern);
    onClose();
  };
  const content = (
    <ScrollArea className="max-h-[60vh] pr-6">
      <div className="prose prose-lg dark:prose-invert max-w-none text-pretty" dangerouslySetInnerHTML={{ __html: pattern.content }} />
      {pattern.codeSamples && pattern.codeSamples.length > 0 && (
        <div className="mt-6">
          <Tabs defaultValue={pattern.codeSamples[0].label}>
            <TabsList>
              {pattern.codeSamples.map(sample => (
                <TabsTrigger key={sample.label} value={sample.label}>{sample.label}</TabsTrigger>
              ))}
            </TabsList>
            {pattern.codeSamples.map(sample => (
              <TabsContent key={sample.label} value={sample.label}>
                <div className="relative">
                  <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{sample.code}</code>
                  </pre>
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => handleCopy(sample.code)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </ScrollArea>
  );
  const header = (
    <>
      <DialogTitle className="text-2xl font-bold font-display">{pattern.title}</DialogTitle>
      <DialogDescription className="text-muted-foreground">{pattern.description}</DialogDescription>
    </>
  );
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader className="text-left">{header}</DrawerHeader>
          <div className="px-4">{content}</div>
          <DrawerFooter className="pt-2">
            <Button onClick={handleBookmark}>
              <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl glass-dark">
        <DialogHeader>{header}</DialogHeader>
        {content}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={handleBookmark}>
            <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'Bookmarked' : 'Save Bookmark'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}