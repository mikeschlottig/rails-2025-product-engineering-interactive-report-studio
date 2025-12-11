import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReportSection } from '@shared/types';
import { Bookmark, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'sonner';
interface ModalCardProps {
  section: ReportSection | null;
  isOpen: boolean;
  onClose: () => void;
  onBookmark: (section: ReportSection, note?: string) => void;
  isBookmarked: boolean;
}
export function ModalCard({ section, isOpen, onClose, onBookmark, isBookmarked }: ModalCardProps) {
  const isMobile = useIsMobile();
  const [note, setNote] = useState('');
  const [copied, setCopied] = useState(false);
  if (!section) return null;
  const handleCopy = () => {
    if (section.codeSample) {
      copy(section.codeSample);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const handleBookmark = () => {
    onBookmark(section, note);
    onClose();
  };
  const content = (
    <>
      <ScrollArea className="max-h-[60vh] pr-6">
        <div className="prose prose-lg dark:prose-invert max-w-none text-pretty" dangerouslySetInnerHTML={{ __html: section.fullContent ?? '' }} />
        {section.codeSample && (
          <div className="mt-6 relative">
            <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm">
              <code>{section.codeSample}</code>
            </pre>
            <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">My Annotation</h3>
          <Textarea
            placeholder="Add a note to your bookmark..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
          />
        </div>
      </ScrollArea>
    </>
  );
  const header = (
    <>
      <DialogTitle className="text-2xl font-bold font-display">{section.title}</DialogTitle>
      <DialogDescription className="text-muted-foreground">
        A deep dive into {section.title.split(': ')[1] || section.title}.
      </DialogDescription>
    </>
  );
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{section.title}</DrawerTitle>
            <DrawerDescription>A deep dive into {section.title.split(': ')[1] || section.title}.</DrawerDescription>
          </DrawerHeader>
          <div className="px-4">{content}</div>
          <DrawerFooter className="pt-2">
            <Button onClick={handleBookmark}>
              <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'Update Bookmark' : 'Save Bookmark'}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
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
            <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} /> {isBookmarked ? 'Update Bookmark' : 'Save Bookmark'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}